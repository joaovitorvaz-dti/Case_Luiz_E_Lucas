using Biblioteca.Domain;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Infrastructure.Data
{
    public class BibliotecaDbContext : DbContext
    {
        public BibliotecaDbContext(DbContextOptions<BibliotecaDbContext> options) : base(options)
        {

        }
        public DbSet<Livro> Livros { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Emprestimo> Emprestimos { get; set; }

    }
       

}
    
