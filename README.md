# API de Tarefas

API REST desenvolvida com Node.js, Express e MongoDB para gerenciamento de tarefas.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv
- Nodemon

---

# Funcionalidades

- Criar tarefas
- Listar tarefas
- Buscar tarefa por ID
- Atualizar tarefas
- Deletar tarefas

---

# Estrutura do Projeto

```bash
src/
├── controllers/
├── database/
├── models/
├── routes/
└── app.js
```

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/JPTirso/API-de-gerenciar-tarefas.git
```

Entre na pasta:

```bash
cd nome-do-projeto
```

Instale as dependências:

```bash
npm install
```

---

# Configuração do .env

Crie um arquivo `.env` na raiz do projeto:

```env
MONGODB_USERNAME=seu_usuario
MONGODB_PASSWORD=sua_senha
```

---

# Executando o Projeto

Modo desenvolvimento:

```bash
npm run start:dev
```

# Endpoints

## Criar tarefa

### POST `/tarefas`

Body:

```json
{
  "titulo": "Estudar Node.js",
  "descricao": "Aprender Express e MongoDB",
  "status": false
}
```

---

## Buscar todas as tarefas

### GET `/tarefas`

---

## Buscar tarefa por ID

### GET `/tarefas/:id`

---

## Atualizar tarefa

### PATCH `/tarefas/:id`

Body:

```json
{
  "titulo": "Novo título"
}
```

---

## Deletar tarefa

### DELETE `/tarefas/:id`

---

# Status Codes

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Erro na requisição |
| 404 | Não encontrado |
| 500 | Erro interno |

---

# Aprendizados

Este projeto foi desenvolvido para praticar:

- API REST
- CRUD
- Arquitetura MVC
- MongoDB
- Mongoose
- Tratamento de erros
- Organização de backend

---

# Autor

João Pedro Tirso Sato
