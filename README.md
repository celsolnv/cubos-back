# API de Gerenciamento de Filmes

API REST desenvolvida em NestJS para gerenciamento de filmes com autenticação, upload de arquivos e integração com S3.

## 🚀 Tecnologias

- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL com TypeORM
- **Autenticação**: JWT
- **Upload**: Multer + AWS S3
- **Documentação**: Swagger/OpenAPI
- **Validação**: class-validator + class-transformer

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- Docker e Docker Compose (opcional)
- Conta AWS com S3 configurado (para upload de arquivos)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd back
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=movies_db

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# AWS S3
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=sua_regiao
AWS_S3_BUCKET=seu_bucket

# App
PORT=3000
NODE_ENV=development
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Docker (Recomendado)
```bash
docker-compose up -d
```

### Opção 2: PostgreSQL local
1. Instale o PostgreSQL
2. Crie um banco de dados chamado `movies_db`
3. Execute as migrações:
```bash
npm run mg-run
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 📚 Documentação da API

Após iniciar o projeto, acesse a documentação Swagger em:
```
http://localhost:3000/docs
```

## 🔐 Autenticação

A API usa JWT para autenticação. Para acessar endpoints protegidos:

1. Faça login em `/auth/login`
2. Use o token retornado no header: `Authorization: Bearer <token>`

## 🎬 Endpoints Principais

### Filmes
- `GET /movies` - Listar filmes (com filtros)
- `POST /movies` - Criar filme
- `GET /movies/:id` - Buscar filme por ID
- `PUT /movies/:id` - Atualizar filme
- `DELETE /movies/:id` - Excluir filme

### Usuários
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `GET /users/profile` - Perfil do usuário

### Upload
- `POST /s3/upload` - Upload de arquivos para S3

## 🔍 Filtros Disponíveis

### Listagem de Filmes
- `name` - Nome do filme
- `genres` - Gêneros (ex: `genres[0]=Ação&genres[1]=Aventura`)
- `director` - Diretor
- `minRating` / `maxRating` - Avaliação (0.0 a 10.0)
- `minDuration` / `maxDuration` - Duração em minutos
- `initial_date` / `end_date` - Data de lançamento (YYYY-MM-DD)
- `page` / `limit` - Paginação

## 📁 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/          # Autenticação e autorização
│   ├── movies/        # Gerenciamento de filmes
│   ├── users/         # Gerenciamento de usuários
│   ├── s3/            # Upload para AWS S3
│   └── mail/          # Serviços de email
├── common/             # Interceptors, filtros, etc.
├── config/             # Configurações da aplicação
├── infra/              # Infraestrutura (database, etc.)
└── utils/              # Utilitários e helpers
```

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute `npm run mg-run`

### Erro de upload para S3
- Verifique as credenciais AWS no `.env`
- Confirme se o bucket existe e tem as permissões corretas

### Erro de validação
- Verifique se todos os campos obrigatórios estão sendo enviados
- Confirme os tipos de dados (ex: datas no formato YYYY-MM-DD)

## 📝 Licença

Este projeto está sob a licença MIT.
