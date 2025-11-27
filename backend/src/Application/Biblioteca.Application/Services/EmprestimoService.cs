using Biblioteca.Application.Interfaces;
using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using FluentValidation;
using static Biblioteca.Domain.Emprestimo;
using static Biblioteca.Domain.Livro;

namespace Biblioteca.Application.Services
{
    public class EmprestimoService : IEmprestimoService
    {
        private readonly IEmprestimoRepository _emprestimoRepository;
        private readonly ILivroRepository _livroRepository;
        private readonly IReservaRepository _reservaRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IValidator<Emprestimo> _validator;

        public EmprestimoService(
            IEmprestimoRepository emprestimoRepository,
            ILivroRepository livroRepository,
            IReservaRepository reservaRepository,
            IUsuarioRepository usuarioRepository,
            IValidator<Emprestimo> validator)
        {
            _emprestimoRepository = emprestimoRepository;
            _livroRepository = livroRepository;
            _reservaRepository = reservaRepository;
            _usuarioRepository = usuarioRepository;
            _validator = validator;
        }

        public async Task<Emprestimo> CriarEmprestimoAsync(int livroId, int usuarioId)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId)
                        ?? throw new KeyNotFoundException("Usuário não encontrado.");

            var livro = await _livroRepository.GetByIdAsync(livroId)
                        ?? throw new KeyNotFoundException("Livro não encontrado.");

            if (livro.Status != StatusLivro.Disponível)
            {
                throw new InvalidOperationException("Livro não está disponível para empréstimo.");
            }

            if (await _reservaRepository.HasActiveReservaAsync(livroId))
            {
                throw new InvalidOperationException("Livro possui reserva pendente.");
            }

            var emprestimoAtivo = await _emprestimoRepository.GetEmprestimoAtivoPorLivroAsync(livroId);
            if (emprestimoAtivo != null)
            {
                throw new InvalidOperationException("Já existe um empréstimo ativo para este livro.");
            }

            var agora = DateTime.UtcNow;
            var emprestimo = new Emprestimo
            {
                LivroId = livroId,
                UsuarioId = usuario.Id,
                DataEmprestimo = agora,
                DataDevolucaoPrevista = agora.AddDays(30),
                Status = StatusEmprestimo.Emprestado
            };

            // Valida o empréstimo
            var validationResult = await _validator.ValidateAsync(emprestimo);
            if (!validationResult.IsValid)
            {
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            livro.Status = StatusLivro.Emprestado;

            await _livroRepository.UpdateAsync(livro);
            return await _emprestimoRepository.AddAsync(emprestimo);
        }

        public async Task<Emprestimo?> RegistrarDevolucaoAsync(int emprestimoId)
        {
            var emprestimo = await _emprestimoRepository.GetByIdAsync(emprestimoId);
            if (emprestimo == null)
            {
                return null;
            }

            if (emprestimo.Status == StatusEmprestimo.Devolvido || emprestimo.Status == StatusEmprestimo.Reservado)
            {
                return emprestimo;
            }

            var livro = await _livroRepository.GetByIdAsync(emprestimo.LivroId)
                        ?? throw new KeyNotFoundException("Livro não encontrado para este empréstimo.");

            emprestimo.DataDevolucaoReal = DateTime.UtcNow;

            // Valida o empréstimo atualizado
            var validationResult = await _validator.ValidateAsync(emprestimo);
            if (!validationResult.IsValid)
            {
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            var reserva = await _reservaRepository.GetProximaReservaAtivaAsync(emprestimo.LivroId);

            if (reserva != null)
            {
                emprestimo.Status = StatusEmprestimo.Reservado;
                livro.Status = StatusLivro.Reservado;
            }
            else
            {
                emprestimo.Status = StatusEmprestimo.Devolvido;
                livro.Status = StatusLivro.Disponível;
            }

            await _emprestimoRepository.UpdateAsync(emprestimo);
            await _livroRepository.UpdateAsync(livro);

            return emprestimo;
        }

        public async Task<Emprestimo?> GetByIdAsync(int id)
        {
            var emprestimo = await _emprestimoRepository.GetByIdAsync(id);
            if (emprestimo == null)
            {
                return null;
            }

            await AtualizarStatusAtrasoSeNecessario(emprestimo);
            return emprestimo;
        }

        public async Task<List<Emprestimo>> GetAllAsync(int? usuarioId, int? livroId, StatusEmprestimo? status)
        {
            var emprestimos = await _emprestimoRepository.GetAllAsync(usuarioId, livroId, status);

            foreach (var emprestimo in emprestimos)
            {
                await AtualizarStatusAtrasoSeNecessario(emprestimo);
            }

            return emprestimos;
        }

        private async Task AtualizarStatusAtrasoSeNecessario(Emprestimo emprestimo)
        {
            if (emprestimo.Status == StatusEmprestimo.Emprestado &&
                DateTime.UtcNow > emprestimo.DataDevolucaoPrevista)
            {
                emprestimo.Status = StatusEmprestimo.Atrasado;
                await _emprestimoRepository.UpdateAsync(emprestimo);
            }
        }
    }
}




