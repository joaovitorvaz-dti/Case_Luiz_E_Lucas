using System.Linq;
using Biblioteca.Application.Interfaces;
using Biblioteca.Domain;
using static Biblioteca.Domain.Usuario;

namespace Biblioteca.Api.Modules
{
    public static class UsuarioModules
    {
        public static void MapUsuariosEndPoint(this WebApplication app)
        {
            var usuariosModule = app.MapGroup("/usuarios");

            usuariosModule.MapGet("", async (IUsuarioService usuarioService, string? nome, string? email, PerfilUsuario? perfil) =>
            {
                var usuarios = await usuarioService.GetAllAsync(nome, email, perfil);
                return Results.Ok(usuarios.Select(ToResponse));
            });

            usuariosModule.MapGet("/{id}", async (int id, IUsuarioService usuarioService) =>
            {
                var usuario = await usuarioService.GetByIdAsync(id);
                if (usuario == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(ToResponse(usuario));
            });

            usuariosModule.MapPost("", async (IUsuarioService usuarioService, UsuarioCreateRequest request) =>
            {
                try
                {
                    var usuario = await usuarioService.CreateAsync(ToDomain(request));
                    return Results.Created($"/usuarios/{usuario.Id}", ToResponse(usuario));
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }
            });

            usuariosModule.MapPut("/{id}", async (int id, IUsuarioService usuarioService, UsuarioUpdateRequest request) =>
            {
                try
                {
                    var usuarioAtualizado = await usuarioService.UpdateAsync(id, ToDomain(request));
                    if (usuarioAtualizado == null)
                    {
                        return Results.NotFound();
                    }

                    return Results.Ok(ToResponse(usuarioAtualizado));
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }
            });

            usuariosModule.MapDelete("/{id}", async (int id, IUsuarioService usuarioService) =>
            {
                var removido = await usuarioService.DeleteAsync(id);
                if (!removido)
                {
                    return Results.NotFound();
                }

                return Results.NoContent();
            });
        }

        private static Usuario ToDomain(UsuarioCreateRequest request) =>
            new Usuario
            {
                Name = request.Name,
                Email = request.Email,
                Senha = request.Senha,
                Perfil = request.Perfil
            };

        private static Usuario ToDomain(UsuarioUpdateRequest request) =>
            new Usuario
            {
                Name = request.Name,
                Email = request.Email,
                Senha = request.Senha,
                Perfil = request.Perfil
            };

        private static UsuarioResponse ToResponse(Usuario usuario) =>
            new UsuarioResponse(usuario.Id, usuario.Name, usuario.Email, usuario.Perfil);

        public record UsuarioCreateRequest(string Name, string Email, string Senha, PerfilUsuario Perfil);

        public record UsuarioUpdateRequest(string Name, string Email, string Senha, PerfilUsuario Perfil);

        public record UsuarioResponse(int Id, string Name, string Email, PerfilUsuario Perfil);
    }
}

