using Biblioteca.Domain;
using static Biblioteca.Domain.Usuario;

namespace Biblioteca.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario?> GetByIdAsync(int id);
        Task<List<Usuario>> GetAllAsync(string? nome, string? email, PerfilUsuario? perfil);
        Task<Usuario> CreateAsync(Usuario usuario);
        Task<Usuario?> UpdateAsync(int id, Usuario usuario);
        Task<bool> DeleteAsync(int id);
    }
}

