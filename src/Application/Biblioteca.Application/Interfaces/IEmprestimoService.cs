using Biblioteca.Domain;
using static Biblioteca.Domain.Emprestimo;

namespace Biblioteca.Application.Interfaces
{
    public interface IEmprestimoService
    {
        Task<Emprestimo> CriarEmprestimoAsync(int livroId, int usuarioId);
        Task<Emprestimo?> RegistrarDevolucaoAsync(int emprestimoId);
        Task<Emprestimo?> GetByIdAsync(int id);
        Task<List<Emprestimo>> GetAllAsync(int? usuarioId, int? livroId, StatusEmprestimo? status);
    }
}

