using System.Net.Mail;
using Biblioteca.Domain;
using FluentValidation;
using static Biblioteca.Domain.Usuario;

namespace Biblioteca.Application.Validators
{
    public class UsuarioValidator : AbstractValidator<Usuario>
    {
        public UsuarioValidator()
        {
            RuleFor(u => u.Name)
                .NotEmpty().WithMessage("Nome é obrigatório.")
                .MinimumLength(3).WithMessage("Nome deve possuir ao menos 3 caracteres.");

            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("E-mail é obrigatório.")
                .EmailAddress().WithMessage("E-mail inválido.")
                .MaximumLength(200).WithMessage("E-mail muito longo.");

            RuleFor(u => u.Senha)
                .NotEmpty().WithMessage("Senha é obrigatória.")
                .MinimumLength(6).WithMessage("Senha deve possuir ao menos 6 caracteres.");

            RuleFor(u => u.Perfil)
                .Must(p => Enum.IsDefined(typeof(PerfilUsuario), p))
                .WithMessage("Perfil informado é inválido.");
        }
    }
}


