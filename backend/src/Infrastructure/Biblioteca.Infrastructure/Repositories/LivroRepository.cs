using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using Biblioteca.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static Biblioteca.Domain.Emprestimo;
using static Biblioteca.Domain.Livro;
using static Biblioteca.Domain.Reserva;

namespace Biblioteca.Infrastructure.Repositories
{
    public class LivroRepository : ILivroRepository
    {
        private readonly BibliotecaDbContext _context;
        public LivroRepository(BibliotecaDbContext context)
        {

            _context = context;
        }
        // get por id 
        public async Task<Livro> GetByIdAsync(int id)
        {
            return await _context.Livros.FindAsync(id);

        }
        // get todos
        public async Task<List<Livro>> GetAllAsync(string? titulo, string? autor, StatusLivro? status)
        {
            var query = _context.Livros.AsQueryable();
            if (!string.IsNullOrEmpty(titulo))
            {
                query = query.Where(l => l.Titulo == titulo);
            }
            if (!string.IsNullOrEmpty(autor))
            {
                query = query.Where(aut => aut.Autor == autor);
            }
            if (status.HasValue)
            {
                query = query.Where(stat => stat.Status == status);
            }

            return await query.ToListAsync();

        }

        public async Task<Livro> AddAsync(Livro livroNovo)
        {
            _context.Livros.Add(livroNovo);
            await _context.SaveChangesAsync();
            return livroNovo;
        }

        public async Task UpdateAsync(Livro livro)
        {
            _context.Livros.Update(livro);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteAsync(Livro livro)
        {
            _context.Livros.Remove(livro);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasActiveEmprestimoAsync(int livroId)
        {
            return await _context.Emprestimos.AnyAsync(e =>
                e.LivroId == livroId &&
                (e.Status == StatusEmprestimo.Emprestado || e.Status == StatusEmprestimo.Atrasado));
        }

        public async Task<bool> HasActiveReservasAsync(int livroId)
        {
            return await _context.Reservas.AnyAsync(r =>
                r.LivroId == livroId &&
                r.Status == StatusReserva.Ativa &&
                r.DataExpiracao > DateTime.UtcNow);
        }

    }
}
