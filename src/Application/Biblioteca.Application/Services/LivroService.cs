using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using FluentValidation;
using System.ComponentModel.DataAnnotations;
using static Biblioteca.Domain.Livro;

namespace Biblioteca.Application.Services
{
    public class LivroService : ILivroService
    {
        private readonly ILivroRepository _livroRepository;
        private readonly IValidator<Livro> _validator;

        public LivroService(ILivroRepository livroRepository, IValidator<Livro> validator)
        {
            _livroRepository = livroRepository;
            _validator = validator;
        }

        public async Task<Livro> GetLivroByIdAsync(int id)
        {
            return await _livroRepository.GetByIdAsync(id);
        }

        public async Task<List<Livro>> GetAllLivrosAsync(string? titulo, string? autor, StatusLivro? status)
        {
            return await _livroRepository.GetAllAsync(titulo, autor, status);
        }

        public async Task<Livro> CreateLivroAsync(Livro livro)
        {
            var validationResult = await _validator.ValidateAsync(livro);
            if (!validationResult.IsValid)
            {
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }
            Livro novoLivro = new Livro
            {
                ISBN = livro.ISBN,
                Ano = livro.Ano,
                Autor = livro.Autor,
                Titulo = livro.Titulo,
                Status = StatusLivro.Disponível
            };
           return await _livroRepository.AddAsync(novoLivro); 
        }

        public async Task<Livro?> UpdateLivroAsync(int id, Livro livroAtualizar)
        {
            var validationResult = await _validator.ValidateAsync(livroAtualizar);
            if (!validationResult.IsValid)
            {
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            if (id != livroAtualizar.Id)
            {
                throw new Exception("ID da URL não corresponde ao ID do corpo da requisição");
            }

            var livroDoBanco = await _livroRepository.GetByIdAsync(id);
            if (livroDoBanco == null)
            {
                return null; 
            }

            livroDoBanco.Titulo = livroAtualizar.Titulo;
            livroDoBanco.Autor = livroAtualizar.Autor;
            livroDoBanco.Ano = livroAtualizar.Ano;
            livroDoBanco.ISBN = livroAtualizar.ISBN;

            await _livroRepository.UpdateAsync(livroDoBanco);
            return livroDoBanco;

        }

        public async Task<bool> DeleteAsync(int id)
        {
            var livroDelete = await _livroRepository.GetByIdAsync(id);
            if(livroDelete == null)
            {
                return false; // nao tem o livro no bd
            }

            if(await _livroRepository.HasActiveEmprestimoAsync(id))
            {
                throw new Exception("Não pode excluir pois possui empréstimos");
            }

            if(await _livroRepository.HasActiveReservasAsync(id))
            {
                throw new Exception("Não pode excluir, possui reservas ativas");
            }

            await _livroRepository.DeleteAsync(livroDelete);

            return true;
        }
    }
}
