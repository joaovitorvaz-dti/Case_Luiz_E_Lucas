using Biblioteca.Domain;
using static Biblioteca.Domain.Livro;

namespace Biblioteca.Application.Interfaces
{
    public interface ILivroService
    {
        Task<Livro> GetLivroByIdAsync(int id);
        Task<List<Livro>> GetAllLivrosAsync(string? titulo, string? autor, StatusLivro? status);
        Task<Livro> CreateLivroAsync(Livro livroCriado);
        Task<Livro?> UpdateLivroAsync(int id, Livro livro);
        Task<bool> DeleteAsync(int id);
    }
}

