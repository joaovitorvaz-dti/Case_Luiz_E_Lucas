using Biblioteca.Application.Interfaces;
using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using FluentValidation;
using static Biblioteca.Domain.Usuario;

namespace Biblioteca.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IValidator<Usuario> _validator;

        public UsuarioService(IUsuarioRepository usuarioRepository, IValidator<Usuario> validator)
        {
            _usuarioRepository = usuarioRepository;
            _validator = validator;
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _usuarioRepository.GetByIdAsync(id);
        }

        public async Task<List<Usuario>> GetAllAsync(string? nome, string? email, PerfilUsuario? perfil)
        {
            return await _usuarioRepository.GetAllAsync(nome, email, perfil);
        }

        public async Task<Usuario> CreateAsync(Usuario usuario)
        {
            var usuarioNormalizado = Normalizar(usuario);

            var validationResult = await _validator.ValidateAsync(usuarioNormalizado);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var existente = await _usuarioRepository.GetByEmailAsync(usuarioNormalizado.Email);
            if (existente != null)
            {
                throw new InvalidOperationException("Já existe um usuário cadastrado com este e-mail.");
            }

            return await _usuarioRepository.AddAsync(usuarioNormalizado);
        }

        public async Task<Usuario?> UpdateAsync(int id, Usuario usuario)
        {
            var usuarioBanco = await _usuarioRepository.GetByIdAsync(id);
            if (usuarioBanco == null)
            {
                return null;
            }

            var usuarioNormalizado = Normalizar(usuario);
            usuarioNormalizado.Id = id;

            var validationResult = await _validator.ValidateAsync(usuarioNormalizado);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var outroComMesmoEmail = await _usuarioRepository.GetByEmailAsync(usuarioNormalizado.Email);
            if (outroComMesmoEmail != null && outroComMesmoEmail.Id != id)
            {
                throw new InvalidOperationException("Já existe outro usuário cadastrado com este e-mail.");
            }

            usuarioBanco.Name = usuarioNormalizado.Name;
            usuarioBanco.Email = usuarioNormalizado.Email;
            usuarioBanco.Senha = usuarioNormalizado.Senha;
            usuarioBanco.Perfil = usuarioNormalizado.Perfil;

            await _usuarioRepository.UpdateAsync(usuarioBanco);
            return usuarioBanco;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var usuarioBanco = await _usuarioRepository.GetByIdAsync(id);
            if (usuarioBanco == null)
            {
                return false;
            }

            await _usuarioRepository.DeleteAsync(usuarioBanco);
            return true;
        }

        private static Usuario Normalizar(Usuario usuario)
        {
            usuario.Name = usuario.Name?.Trim() ?? string.Empty;
            usuario.Email = usuario.Email?.Trim().ToLowerInvariant() ?? string.Empty;
            usuario.Senha = usuario.Senha?.Trim() ?? string.Empty;
            return usuario;
        }
        
    }
}

