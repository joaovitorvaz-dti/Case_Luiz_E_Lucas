using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using Biblioteca.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static Biblioteca.Domain.Reserva;

namespace Biblioteca.Infrastructure.Repositories
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly BibliotecaDbContext _context;

        public ReservaRepository(BibliotecaDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasActiveReservaAsync(int livroId)
        {
            return await _context.Reservas.AnyAsync(r =>
                r.LivroId == livroId &&
                r.Status == StatusReserva.Ativa &&
                r.DataExpiracao > DateTime.UtcNow);
        }

        public async Task<Reserva?> GetProximaReservaAtivaAsync(int livroId)
        {
            return await _context.Reservas
                .Include(r => r.Usuario)
                .Where(r =>
                    r.LivroId == livroId &&
                    r.Status == StatusReserva.Ativa &&
                    r.DataExpiracao > DateTime.UtcNow)
                .OrderBy(r => r.DataReserva)
                .FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Reserva reserva)
        {
            _context.Reservas.Update(reserva);
            await _context.SaveChangesAsync();
        }
    }
}






