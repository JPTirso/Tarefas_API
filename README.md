# Tarefas API

API REST para gerenciamento de tarefas com autenticação JWT. Cada usuário gerencia apenas suas próprias tarefas, com total isolamento de dados entre contas.

## Tecnologias

- **Node.js** com Express 5
- **MongoDB** via Mongoose
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Dotenv** para variáveis de ambiente

---

## Instalação

```bash
# Clone o repositório
git clone <https://github.com/JPTirso/Tarefas_API.git>
cd Tarefas_API

# Instale as dependências
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGODB_USERNAME=seu_usuario_mongodb
MONGODB_PASSWORD=sua_senha_mongodb
SECRET=sua_chave_secreta_jwt
```

> A string de conexão aponta para um cluster MongoDB Atlas. Certifique-se de que o IP da sua máquina está liberado no Atlas.

---

## Rodando o projeto

```bash
# Produção
npm start

# Desenvolvimento (com hot reload via nodemon)
npm run start:dev
```

O servidor sobe na porta **3939**.

---

## Estrutura do projeto

```
Tarefas_API-main/
├── servidor.js                        # Entry point
└── src/
    ├── controllers/
    │   ├── tarefas.controller.js      # CRUD de tarefas
    │   └── users.controller.js        # Registro, login e atualização de usuário
    ├── database/
    │   └── connection.js              # Conexão com MongoDB Atlas
    ├── middleware/
    │   ├── auth.middleware.js         # Verificação do JWT
    │   └── perm.middleware.js         # Verificação de role admin
    ├── models/
    │   ├── TarefaModel.js             # Schema de tarefas
    │   └── UserModel.js               # Schema de usuários
    └── routes/
        ├── tarefas.routes.js          # Rotas de tarefas
        └── users.routes.js            # Rotas de usuários
```

---

## Modelos de dados

### User

| Campo      | Tipo     | Obrigatório | Padrão  |
|------------|----------|-------------|---------|
| `nome`     | String   | Sim         | —       |
| `email`    | String   | Sim         | —       |
| `password` | String   | Sim         | —       |
| `role`     | String   | Não         | `"user"` |

### Tarefa

| Campo       | Tipo      | Obrigatório | Padrão  |
|-------------|-----------|-------------|---------|
| `titulo`    | String    | Sim         | —       |
| `descricao` | String    | Sim         | —       |
| `concluida` | Boolean   | Não         | `false` |
| `userId`    | ObjectId  | Sim         | —       |

> Cada tarefa é vinculada ao usuário que a criou via `userId`. Todas as operações de leitura, atualização e deleção filtram por `userId`, garantindo que um usuário nunca acesse dados de outro.

---

## Autenticação

Rotas protegidas exigem um token JWT no header:

```
Authorization: Bearer <token>
```

O token é obtido na rota `POST /users/login` e tem validade de **7 dias**.

---

## Rotas

### Usuários — `/users`

| Método | Rota        | Auth | Descrição                        |
|--------|-------------|------|----------------------------------|
| POST   | `/registro` | Não  | Cria uma nova conta              |
| POST   | `/login`    | Não  | Autentica e retorna o JWT        |
| GET    | `/`         | Sim  | Retorna o perfil do usuário logado |
| PATCH  | `/`         | Sim  | Atualiza dados do usuário logado |

#### POST `/users/registro`

```json
{
  "nome": "Jonh Doe",
  "email": "jonhdoe@email.com",
  "password": "12345",
  "confirmPassword": "12345"
}
```

**Resposta 201:**
```json
{ "message": "Usuario criado com sucesso" }
```

---

#### POST `/users/login`

```json
{
  "email": "jonhdoe@email.com",
  "password": "12345"
}
```

**Resposta 200:**
```json
{ "token": "<jwt>" }
```

---

#### GET `/users/`  *(requer auth)*

Retorna os dados do usuário autenticado. A senha nunca é incluída na resposta.

**Resposta 200:**
```json
{
  "_id": "...",
  "nome": "Jonh Doe",
  "email": "jonhdoe@email.com",
  "role": "user"
}
```

---

#### PATCH `/users/`  *(requer auth)*

Atualiza um ou mais campos do usuário autenticado. Envie apenas os campos que deseja alterar.

```json
{
  "nome": "Jane Doe",
  "email": "novo@email.com",
  "password": "123455",
  "confirmPassword": "123456"
}
```

**Regras:**
- O email novo não pode estar em uso por outro usuário.
- A nova senha não pode ser igual à senha atual.
- `confirmPassword` é obrigatório quando `password` é enviado.

**Resposta 200:**
```json
{ "message": "Alteração feita com sucesso" }
```

---

### Tarefas — `/tarefas`

Todas as rotas exigem autenticação. As operações são sempre filtradas pelo usuário autenticado.

| Método | Rota   | Descrição                           |
|--------|--------|-------------------------------------|
| POST   | `/`    | Cria uma nova tarefa                |
| GET    | `/`    | Lista todas as tarefas do usuário   |
| GET    | `/:id` | Retorna uma tarefa pelo ID          |
| PATCH  | `/:id` | Atualiza uma tarefa                 |
| DELETE | `/:id` | Remove uma tarefa                   |

#### POST `/tarefas/`

```json
{
  "titulo": "Terminar o Notify",
  "descricao": "É um projeto de organização de estudos"
}
```

**Resposta 201:** retorna o objeto da tarefa criada.

---

#### GET `/tarefas/`

Retorna um array com todas as tarefas do usuário autenticado.

**Resposta 200:**
```json
[
  {
    "_id": "...",
    "titulo": "Terminar o Notify",
    "descricao": "É um projeto de organização de estudos",
    "concluida": false,
    "userId": "..."
  }
]
```

---

#### GET `/tarefas/:id`

Retorna a tarefa com o ID especificado, desde que pertença ao usuário autenticado.

**Resposta 404** se não encontrada ou pertencer a outro usuário.

---

#### PATCH `/tarefas/:id`

Atualiza campos da tarefa. Envie apenas o que deseja alterar. Campos iguais aos valores atuais são ignorados.

```json
{
  "titulo": "Novo título",
  "concluida": true
}
```

**Resposta 400** se nenhuma mudança real for detectada.

---

#### DELETE `/tarefas/:id`

Remove a tarefa. Retorna o objeto deletado em caso de sucesso.

**Resposta 404** se não encontrada ou pertencer a outro usuário.

---

## Códigos de resposta

| Código | Significado                                       |
|--------|---------------------------------------------------|
| 200    | Sucesso                                           |
| 201    | Recurso criado                                    |
| 400    | Dados inválidos ou sem alterações detectadas      |
| 401    | Token ausente ou inválido                         |
| 404    | Recurso não encontrado                            |
| 500    | Erro interno do servidor                          |