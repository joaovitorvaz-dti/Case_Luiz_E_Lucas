
using Biblioteca.Api.Modules;
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

// Add services to the container.
builder.Services.AddValidatorsFromAssemblyContaining<LivroValidator>(); // coloquei o validador das rules
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ILivroRepository, LivroRepository>();
builder.Services.AddScoped<ILivroService, LivroService>();
builder.Services.AddDbContext<BibliotecaDbContext>(options =>
    options.UseSqlServer(ConnectionString));



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapLivrosEndPoint();


app.Run();

