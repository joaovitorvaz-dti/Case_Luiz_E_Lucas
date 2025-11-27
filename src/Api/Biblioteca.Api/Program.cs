
using Biblioteca.Api.Modules;
using Biblioteca.Application.Interfaces;
using Biblioteca.Application.Services;
using Biblioteca.Application.Validators;
using Biblioteca.Domain;
using Biblioteca.Domain.Interfaces;
using Biblioteca.Infrastructure.Data;
using Biblioteca.Infrastructure.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options => // corrigindo meu erro de cors no front end 
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // A porta do  Front-end
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// Add services to the container.
builder.Services.AddValidatorsFromAssemblyContaining<LivroValidator>(); // coloquei o validador das rules
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ILivroRepository, LivroRepository>();
builder.Services.AddScoped<IEmprestimoRepository, EmprestimoRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ILivroService, LivroService>();
builder.Services.AddScoped<IEmprestimoService, EmprestimoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddDbContext<BibliotecaDbContext>(options =>
    options.UseSqlServer(ConnectionString));



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins); //  API usa a permissao

app.MapLivrosEndPoint();
app.MapEmprestimosEndPoint();
app.MapUsuariosEndPoint();


app.Run();

