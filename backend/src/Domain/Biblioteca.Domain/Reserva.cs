namespace Biblioteca.Domain
{
    public class Reserva
    {

        public enum StatusReserva
        {
            Ativa,
            Concluida,
            Cancelada,
        }
        public int Id { get; set; }

        public StatusReserva Status { get; set; }

        public int LivroId { get; set; }
        public Livro? Livro { get; set; }

        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        public DateTime DataReserva {  get; set; }
        public DateTime DataExpiracao { get; set; }
    }
}
