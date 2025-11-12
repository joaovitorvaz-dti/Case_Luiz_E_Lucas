using Biblioteca.Domain;
using FluentValidation;
namespace Biblioteca.Application.Validators
{
    public class LivroValidator : AbstractValidator<Livro>
    {
        public LivroValidator() 
        {
            RuleFor(l => l.Titulo).NotEmpty().Length(3, 200);
            RuleFor(l => l.Autor).NotEmpty();
            RuleFor(l => l.Ano).GreaterThanOrEqualTo(1900);
            RuleFor(l => l.ISBN).NotEmpty().Length(13, 13); 
        }
    }
}
