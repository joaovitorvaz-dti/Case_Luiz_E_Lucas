using Biblioteca.Application.Interfaces;
using static Biblioteca.Domain.Emprestimo;

namespace Biblioteca.Api.Modules
{
    public static class EmprestimoModules
    {
        public static void MapEmprestimosEndPoint(this WebApplication app)
        {
            var emprestimosModule = app.MapGroup("/emprestimos");

            emprestimosModule.MapGet("", async (
                IEmprestimoService emprestimoService,
                int? usuarioId,
                int? livroId,
                StatusEmprestimo? status) =>
            {
                var emprestimos = await emprestimoService.GetAllAsync(usuarioId, livroId, status);
                return Results.Ok(emprestimos);
            });

            emprestimosModule.MapGet("/{id}", async (int id, IEmprestimoService emprestimoService) =>
            {
                var emprestimo = await emprestimoService.GetByIdAsync(id);
                if (emprestimo == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(emprestimo);
            });

            emprestimosModule.MapPost("", async (IEmprestimoService emprestimoService, EmprestimoCreateRequest request) =>
            {
                try
                {
                    var emprestimo = await emprestimoService.CriarEmprestimoAsync(request.LivroId, request.UsuarioId);
                    return Results.Created($"/emprestimos/{emprestimo.Id}", emprestimo);
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }
            });

            emprestimosModule.MapPost("/{id}/devolucao", async (int id, IEmprestimoService emprestimoService) =>
            {
                var emprestimo = await emprestimoService.RegistrarDevolucaoAsync(id);
                if (emprestimo == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(emprestimo);
            });
        }

        public record EmprestimoCreateRequest(int LivroId, int UsuarioId);
    }
}




