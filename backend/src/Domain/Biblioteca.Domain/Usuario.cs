using System.ComponentModel.DataAnnotations;

namespace Biblioteca.Domain
{
    public class Usuario
    {
        public enum PerfilUsuario
        {
            Leitor, 
            Administrador,
            Bibliotecario,
        }
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Senha {  get; set; } = string.Empty;

        public PerfilUsuario Perfil { get; set; }

    }
}
