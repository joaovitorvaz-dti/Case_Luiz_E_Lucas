# Biblioteca API - Case Dti

 Projeto backend em .NET 8 que implementa uma API mínima para gerenciamento de uma biblioteca (livros, usuários, empréstimos e reservas). Usa Entity Framework Core com SQL Server (localdb por padrão), FluentValidation para validações e endpoints minimal APIs.

visão geral, estrutura de pastas, como rodar localmente, string de conexão, endpoints principais, padrões e recomendações de segurança e melhorias.

**Stack:** .NET 8, C#, Entity Framework Core, FluentValidation, Swagger

**Localização principal do código:**
- API minimal: `src/Api/Biblioteca.Api/Program.cs` e `src/Api/Biblioteca.Api/Modules/*` (endpoints)
- Aplicação / regras: `src/Application/Biblioteca.Application/Services/*` (serviços) e `src/Application/Biblioteca.Application/Validators/*` (validadores)
- Domínio/Entidades: `src/Domain/Biblioteca.Domain/*` (Usuario, Livro, Emprestimo, Reserva)
- Infra/DB: `src/Infrastructure/Biblioteca.Infrastructure/Data/BibliotecaDbContext.cs` e `src/Infrastructure/Biblioteca.Infrastructure/Repositories/*` (repositórios)
- Migrations: `src/Infrastructure/Biblioteca.Infrastructure/Migrations/*`

**Como rodar (desenvolvimento)**

Pré-requisitos:
- .NET 8 SDK instalado
- SQL Server LocalDB (opcional — usa `(localdb)\\mssqllocaldb` por padrão)

Passos (PowerShell):

```powershell
# Entrar na pasta do projeto (exemplo)
cd C:\Users\<seu_usuario>\Desktop\workspace-case\Case_Luiz_E_Lucas

# Restaurar e rodar a API
dotnet restore
dotnet build
dotnet run --project src/Api/Biblioteca.Api
```

Após o start, o Swagger fica disponível em `https://localhost:<porta>/swagger/index.html` (o console mostra a porta).

**String de conexão**
- Arquivo: `src/Api/Biblioteca.Api/appsettings.json`
- Valor padrão: `Server=(localdb)\\mssqllocaldb;Database=BibliotecaDb;Trusted_Connection=True;`
- Onde é usado: `Program.cs` carrega `DefaultConnection` e registra o DbContext via `builder.Services.AddDbContext<BibliotecaDbContext>(options => options.UseSqlServer(ConnectionString));`

Para ambientes diferentes, prefira variáveis de ambiente ou secrets:

```powershell
# Exemplo de variável no Windows PowerShell (sessão atual)
$env:ConnectionStrings__DefaultConnection = "Server=...;Database=...;User Id=...;Password=...;"
``` 

**Endpoints principais (resumo)**
- `GET /usuarios` — listar (aceita filtros `nome`, `email`, `perfil`)
- `GET /usuarios/{id}` — obter por id
- `POST /usuarios` — criar usuário (body: `Name`, `Email`, `Senha`, `Perfil`)
- `PUT /usuarios/{id}` — atualizar usuário
- `DELETE /usuarios/{id}` — deletar usuário

- `GET /livros`, `GET /livros/{id}`, `POST /livros`, `PUT /livros/{id}`, `DELETE /livros/{id}`
- `POST /emprestimos` (criando empréstimo) e endpoints de devolução/consulta (ver `EmprestimoModules`)
- `POST /reservas` e rotas relacionadas (ver `ReservaModules`)

Os módulos estão em `src/Api/Biblioteca.Api/Modules/*.cs` e usam DTOs simples (`record`) para requests/responses.

**Validações**
- O projeto usa **FluentValidation**. Validadores implementados:
	- `LivroValidator` (já existente)
	- `UsuarioValidator` (nome, e-mail, senha mínima)
	- `EmprestimoValidator` (datas, ids, status)
	- `ReservaValidator` (datas, ids, status)
- Os validadores são registrados automaticamente com `builder.Services.AddValidatorsFromAssemblyContaining<LivroValidator>();` em `Program.cs`.

Observação: os validadores usados em serviços lançam `FluentValidation.ValidationException` em caso de falha; o tratamento global de exceções deve mapear isso para HTTP 400 com mensagens.

**Padrões de código observados**
- Campos privados usam underscore (`_usuarioRepository`) — convenção C# comum para campos privados.
- Serviços (`*Service`) encapsulam lógica de domínio e orquestram repositórios.
- Repositórios usam EF Core (`DbContext`) e retornam entidades assíncronas.

**Segurança e pontos críticos observados**
- Senhas atualmente em texto plain (`Usuario.Senha`). Isso é crítico: implemente hashing (BCrypt/Argon2) antes de persistir e remova a senha de qualquer response DTO.
- Falta autenticação/autorization (JWT) nas rotas — importante para proteger ações sensíveis (criar/atualizar/deletar).
- Colocar índice único em `Email` no banco via migration para garantir unicidade.


**Migrações e banco de dados**
- Migrations existentes em `src/Infrastructure/Biblioteca.Infrastructure/Migrations`.
- Para aplicar migrations localmente:

```powershell
dotnet tool install --global dotnet-ef  # se necessário
dotnet ef database update --project src/Infrastructure/Biblioteca.Infrastructure --startup-project src/Api/Biblioteca.Api
```

**Testes e qualidade**
- Não há testes automáticos no repositório atual. Recomendo adicionar testes unitários para:
	- `UsuarioService` (validação, normalização, tratamento de duplicidade de email)
	- `LivroService` (regras de exclusão/emprestimo)
	- Validators (cenários válidos/inválidos)

## Frontend (React + TypeScript)

Este repositório contém também o frontend da aplicação na pasta `biblioteca-frontend/` (React + TypeScript + Vite).

Resumo rápido do frontend localizado em `biblioteca-frontend/`:

- Scaffold: Vite (template `react-ts`).
- Scripts disponíveis (ver `biblioteca-frontend/package.json`): `dev`, `build`, `preview`.
- Porta padrão de desenvolvimento do Vite: `5173`.

Como rodar o frontend localmente:

```bash
# na raiz do repositório
cd biblioteca-frontend
npm install
npm run dev
```

O frontend usa dependências como `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `axios` e MUI. Veja `biblioteca-frontend/package.json` para detalhes.

Configuração de ambiente e comunicação com a API:
- A API, por padrão, expõe o Swagger em `https://localhost:<porta>/swagger`. Em `Program.cs` o CORS está configurado para permitir `http://localhost:5173` (porta padrão do Vite). Se usar outra porta, atualize `Program.cs` ou a variável de ambiente do frontend.
- Recomendo criar um arquivo `.env.local` com a URL base da API:

```
VITE_API_URL=https://localhost:7215
```

Exemplo simples de chamada usando `fetch` (em React):

```ts
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return await res.json();
}
```
