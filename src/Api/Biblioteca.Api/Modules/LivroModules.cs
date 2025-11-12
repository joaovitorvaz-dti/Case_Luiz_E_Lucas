using Biblioteca.Domain;
using Biblioteca.Application.Services;
using static Biblioteca.Domain.Livro;

namespace Biblioteca.Api.Modules
{
    public static class LivroModules
    {
        public static void MapLivrosEndPoint(this WebApplication app)
        {

            var livrosModule = app.MapGroup("/livros"); // get padrão

            livrosModule.MapGet("", async(ILivroService livroService, string ? titulo, string? autor, StatusLivro? status) =>
            {

              var livros = await livroService.GetAllLivrosAsync(titulo, autor, status);
              return Results.Ok(livros);
            });

            // get com id
            livrosModule.MapGet("/{id}", async (int Id, ILivroService livroService) =>
            {
                var livros = await livroService.GetLivroByIdAsync(Id);

                if (livros == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(livros);

            });

            // post

            livrosModule.MapPost("", async (ILivroService livroService, Livro livroUsuario) =>
                {
                    try
                    {
                        var novoLivro = await livroService.CreateLivroAsync(livroUsuario); // TENTA CRIAR

                        return Results.Created($"/livros/{novoLivro.Id}", novoLivro);
                    }
                    catch (Exception ex)
                    {
                        return Results.BadRequest();
                    }

                });

            livrosModule.MapPut("/{id}", async (int id, Livro livro, ILivroService livroService) =>
            {
                try
                {
                    var livroAtualizado = await livroService.UpdateLivroAsync(id, livro); // TENTA CRIAR

                    if (livroAtualizado == null)
                    {
                        return Results.NotFound();
                    }

                    return Results.NoContent(); // 204 
                }
                catch (Exception ex)
                {
                    return Results.BadRequest();
                }
                // tenho que voltar aqui pra implementar o processo de apenas adm ou bibliotecario pode editar
            });

            livrosModule.MapDelete("/{id}", async (int Id, ILivroService livroService) =>
            {
                try
                {
                    var sucesso = await livroService.DeleteAsync(Id);

                    if (sucesso == false)
                    {
                        return Results.NotFound(); // não removeu pq nao tem 
                    }
                    return Results.NoContent();  // http 204 (deu bom)
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(); // nao p0ode excluir pois tem alguma regra impedindo 
                }
                 // voltar depois pois so adm remove livros
            });

        }
    }
}
