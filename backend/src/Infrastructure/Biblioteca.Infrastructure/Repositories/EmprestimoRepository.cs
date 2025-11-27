using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using Biblioteca.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static Biblioteca.Domain.Emprestimo;

namespace Biblioteca.Infrastructure.Repositories
{
    public class EmprestimoRepository : IEmprestimoRepository
    {
        private readonly BibliotecaDbContext _context;

        public EmprestimoRepository(BibliotecaDbContext context)
        {
            _context = context;
        }

        public async Task<Emprestimo?> GetByIdAsync(int id)
        {
            return await _context.Emprestimos
                .Include(e => e.Livro)
                .Include(e => e.Usuario)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Emprestimo>> GetAllAsync(int? usuarioId, int? livroId, StatusEmprestimo? status)
        {
            var query = _context.Emprestimos
                .Include(e => e.Livro)
                .Include(e => e.Usuario)
                .AsQueryable();

            if (usuarioId.HasValue)
            {
                query = query.Where(e => e.UsuarioId == usuarioId.Value);
            }

            if (livroId.HasValue)
            {
                query = query.Where(e => e.LivroId == livroId.Value);
            }

            if (status.HasValue)
            {
                query = query.Where(e => e.Status == status.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Emprestimo> AddAsync(Emprestimo emprestimo)
        {
            _context.Emprestimos.Add(emprestimo);
            await _context.SaveChangesAsync();
            return emprestimo;
        }

        public async Task UpdateAsync(Emprestimo emprestimo)
        {
            _context.Emprestimos.Update(emprestimo);
            await _context.SaveChangesAsync();
        }

        public async Task<Emprestimo?> GetEmprestimoAtivoPorLivroAsync(int livroId)
        {
            return await _context.Emprestimos
                .Where(e => e.LivroId == livroId &&
                            (e.Status == StatusEmprestimo.Emprestado || e.Status == StatusEmprestimo.Atrasado))
                .Include(e => e.Usuario)
                .Include(e => e.Livro)
                .FirstOrDefaultAsync();
        }
    }
}
