using static Biblioteca.Domain.Livro;

namespace Biblioteca.Domain.Interfaces
{
    public interface ILivroRepository
    {
        Task<Livro> GetByIdAsync(int id);
        Task<List<Livro>> GetAllAsync(string? titulo, string? autor, StatusLivro? status);

        Task<Livro> AddAsync (Livro livroNovo);

        Task UpdateAsync (Livro livroNovo);

        Task DeleteAsync (Livro livro);
        Task<bool> HasActiveEmprestimoAsync(int livroId);
        Task<bool> HasActiveReservasAsync(int livroId);

    }
}
