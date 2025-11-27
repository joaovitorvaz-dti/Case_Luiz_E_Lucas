using Biblioteca.Domain;

namespace Biblioteca.Domain.Interfaces
{
    public interface IReservaRepository
    {
        Task<bool> HasActiveReservaAsync(int livroId);
        Task<Reserva?> GetProximaReservaAtivaAsync(int livroId);
        Task UpdateAsync(Reserva reserva);
    }
}
