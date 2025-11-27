using Biblioteca.Domain;
using FluentValidation;

namespace Biblioteca.Application.Validators
{
    public class ReservaValidator : AbstractValidator<Reserva>
    {
        public ReservaValidator()
        {
            RuleFor(r => r.UsuarioId)
                .GreaterThan(0).WithMessage("UsuarioId deve ser maior que 0");

            RuleFor(r => r.LivroId)
                .GreaterThan(0).WithMessage("LivroId deve ser maior que 0");

            RuleFor(r => r.DataReserva)
                .NotEmpty().WithMessage("Data de reserva é obrigatória")
                .Must(d => d <= DateTime.UtcNow).WithMessage("Data de reserva não pode ser futura");

            RuleFor(r => r.DataExpiracao)
                .NotEmpty().WithMessage("Data de expiração é obrigatória")
                .GreaterThan(r => r.DataReserva).WithMessage("Data de expiração deve ser após a data de reserva");

            RuleFor(r => r.Status)
                .IsInEnum().WithMessage("Status inválido");
        }
    }
}
