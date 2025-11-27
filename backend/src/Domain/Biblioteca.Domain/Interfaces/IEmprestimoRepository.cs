using static Biblioteca.Domain.Emprestimo;

namespace Biblioteca.Domain.Interfaces
{
    public interface IEmprestimoRepository
    {
        Task<Emprestimo?> GetByIdAsync(int id);
        Task<List<Emprestimo>> GetAllAsync(int? usuarioId, int? livroId, StatusEmprestimo? status);
        Task<Emprestimo> AddAsync(Emprestimo emprestimo); 
        Task UpdateAsync(Emprestimo emprestimo); //aq irá atualizar no banco 
        Task<Emprestimo?> GetEmprestimoAtivoPorLivroAsync(int livroId); //business rule
    }
}
