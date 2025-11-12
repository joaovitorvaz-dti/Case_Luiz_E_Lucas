namespace Biblioteca.Domain
{
    public class Livro
    {
        public enum StatusLivro // enum com o status do livro 
        {
            Disponível,
            Emprestado,
            Reservado,
        }
        public int Id { get; set; }  // o que o meeu bd vai receber dda entidade livro 
        public string ISBN { get; set; } = string.Empty;
        public string Titulo { get; set; } = string.Empty;
        public int Ano { get; set; }
        public string Autor { get; set; } = string.Empty;

        public StatusLivro Status { get; set; }

    }
}

