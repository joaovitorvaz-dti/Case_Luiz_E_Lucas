using Biblioteca.Domain;
using FluentValidation;

namespace Biblioteca.Application.Validators
{
    public class EmprestimoValidator : AbstractValidator<Emprestimo>
    {
        public EmprestimoValidator()
        {
            RuleFor(e => e.UsuarioId)
                .GreaterThan(0).WithMessage("UsuarioId deve ser maior que 0");

            RuleFor(e => e.LivroId)
                .GreaterThan(0).WithMessage("LivroId deve ser maior que 0");

            RuleFor(e => e.DataEmprestimo)
                .NotEmpty().WithMessage("Data de empréstimo é obrigatória")
                .Must(d => d <= DateTime.UtcNow).WithMessage("Data de empréstimo não pode ser futura");

            RuleFor(e => e.DataDevolucaoPrevista)
                .NotEmpty().WithMessage("Data de devolução prevista é obrigatória")
                .GreaterThan(e => e.DataEmprestimo).WithMessage("Data de devolução deve ser após a data de empréstimo");

            RuleFor(e => e.DataDevolucaoReal)
                .GreaterThanOrEqualTo(e => e.DataEmprestimo)
                .When(e => e.DataDevolucaoReal.HasValue)
                .WithMessage("Data de devolução real não pode ser antes da data de empréstimo");

            RuleFor(e => e.Status)
                .IsInEnum().WithMessage("Status inválido");
        }
    }
}
