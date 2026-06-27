# Tarefas API

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/auth-JWT-orange)
![License](https://img.shields.io/badge/license-ISC-blue)

API REST para gerenciamento de tarefas pessoais, com autenticação via JWT (access token + refresh token) e um painel administrativo simples baseado em papéis (`user` / `admin`). Cada usuário só acessa e manipula as próprias tarefas — o isolamento de dados é garantido em nível de query, filtrando sempre por `userId`.

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Executando o projeto](#executando-o-projeto)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelos de dados](#modelos-de-dados)
- [Autenticação](#autenticação)
- [Rotas — Usuários](#rotas--usuários-users)
- [Rotas — Tarefas](#rotas--tarefas-tarefas)
- [Rotas — Administração](#rotas--administração-adm)
- [Formato de erros de validação](#formato-de-erros-de-validação)
- [Códigos de resposta](#códigos-de-resposta)
- [Licença](#licença)

---

## Tecnologias

| Camada              | Tecnologia                                |
|---------------------|-------------------------------------------|
| Runtime             | Node.js                                   |
| Framework HTTP      | Express 5                                 |
| Banco de dados      | MongoDB (via Mongoose), hospedado no Atlas|
| Autenticação        | JSON Web Token (access + refresh)         |
| Hash de senha       | bcrypt                                    |
| Validação de schema | Zod                                       |
| Configuração        | dotenv                                    |
| Hot reload (dev)    | nodemon                                   |

## Pré-requisitos

- Node.js 18 ou superior
- npm
- Um cluster MongoDB Atlas configurado, com o IP da máquina liberado na lista de acesso

## Instalação

```bash
git clone https://github.com/JPTirso/Tarefas_API.git
cd Tarefas_API
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGODB_USERNAME=seu_usuario_mongodb
MONGODB_PASSWORD=sua_senha_mongodb
ACESSSECRET=sua_chave_secreta_para_o_access_token
REFRESHSECRET=sua_chave_secreta_para_o_refresh_token
```

| Variável            | Descrição                                                                 |
|---------------------|----------------------------------------------------------------------------|
| `MONGODB_USERNAME`  | Usuário do banco no cluster Atlas                                          |
| `MONGODB_PASSWORD`  | Senha do usuário do banco                                                   |
| `ACESSSECRET`       | Chave usada para assinar o **access token** (validade curta)               |
| `REFRESHSECRET`     | Chave usada para assinar o **refresh token** (validade longa)              |

> O host do cluster está fixo em `src/database/connection.js`; apenas as credenciais vêm do `.env`. Se for usar outro cluster, ajuste a string de conexão diretamente nesse arquivo.

## Executando o projeto

```bash
# Produção
npm start

# Desenvolvimento (hot reload via nodemon)
npm run start:dev
```

O servidor sobe na porta **3939**.

## Estrutura do projeto

```
Tarefas_API-main/
├── servidor.js                        # Entry point
└── src/
    ├── controllers/
    │   ├── adm.controller.js          # Listagem, visualização e remoção de usuários (admin)
    │   ├── tarefas.controller.js      # CRUD de tarefas
    │   └── users.controller.js        # Registro, login, refresh, logout, perfil e conta
    ├── database/
    │   └── connection.js              # Conexão com MongoDB Atlas
    ├── middleware/
    │   ├── auth.middleware.js         # Verificação do access token
    │   ├── perm.middleware.js         # Verificação de role "admin"
    │   └── validation.middleware.js   # Validação de body e de :id via Zod
    ├── models/
    │   ├── TarefaModel.js             # Schema de tarefas
    │   └── UserModel.js               # Schema de usuários
    ├── routes/
    │   ├── adm.routes.js              # Rotas administrativas
    │   ├── tarefas.routes.js          # Rotas de tarefas
    │   └── users.routes.js            # Rotas de usuários
    └── validation/
        ├── id.schema.js               # Validação de ObjectId
        ├── tarefa.schema.js           # Validação de payloads de tarefa
        └── user.schema.js             # Validação de payloads de usuário
```

## Modelos de dados

### User

| Campo          | Tipo     | Obrigatório | Padrão   | Observações                                 |
|----------------|----------|-------------|----------|---------------------------------------------|
| `nome`         | String   | Sim         | —        | 3–100 caracteres                            |
| `email`        | String   | Sim         | —        | Único, indexado                             |
| `password`     | String   | Sim         | —        | Armazenada com hash bcrypt                  |
| `role`         | String   | Não         | `"user"` | Não há rota para promoção a `"admin"`       |
| `refreshToken` | String   | Não         | —        | Token de sessão ativo, usado em `/refresh`  |

### Tarefa

| Campo       | Tipo      | Obrigatório | Padrão  |
|-------------|-----------|-------------|---------|
| `titulo`    | String    | Sim         | —       |
| `descricao` | String    | Não         | —       |
| `concluida` | Boolean   | Não         | `false` |
| `userId`    | ObjectId  | Sim         | —       |

> Toda operação de leitura, atualização e remoção de tarefas filtra pelo `userId` do token, garantindo que um usuário nunca acesse dados de outro.

## Autenticação

A API usa um par de tokens:

| Token           | Assinado com    | Validade  | Uso                                                          |
|-----------------|-----------------|-----------|--------------------------------------------------------------|
| Access token    | `ACESSSECRET`   | 15 min    | Enviado no header `Authorization` das rotas protegidas       |
| Refresh token   | `REFRESHSECRET` | 30 dias   | Enviado apenas em `POST /users/refresh` para gerar novo par  |

```
Authorization: Bearer <access_token>
```

O refresh token é persistido no documento do usuário (`refreshToken`). Ao fazer `POST /users/refresh`, a API confirma que o token enviado é válido **e** corresponde ao que está salvo no banco antes de emitir um novo par. `GET /users/logout` invalida o refresh token atual, setando-o como `null`.

## Rotas — Usuários (`/users`)

| Método | Rota        | Auth          | Descrição                                             |
|--------|-------------|---------------|-------------------------------------------------------|
| POST   | `/registro` | Não           | Cria uma conta e retorna o par de tokens              |
| POST   | `/login`    | Não           | Autentica e retorna um novo par de tokens             |
| POST   | `/refresh`  | Refresh token | Gera um novo par de tokens                            |
| GET    | `/`         | Sim           | Retorna o perfil do usuário autenticado               |
| PATCH  | `/`         | Sim           | Atualiza nome, email e/ou senha do usuário autenticado|
| DELETE | `/`         | Sim           | Remove a conta do usuário autenticado e suas tarefas  |
| GET    | `/logout`   | Sim           | Invalida o refresh token atual                        |

#### POST `/users/registro`

```json
{
  "nome": "Jonh Doe",
  "email": "jonhdoe@email.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**Resposta 201:**
```json
{
  "message": "Usuario criado com sucesso",
  "refreshToken": "<jwt>",
  "acessToken": "<jwt>"
}
```

#### POST `/users/login`

```json
{
  "email": "jonhdoe@email.com",
  "password": "123456"
}
```

**Resposta 201:**
```json
{
  "message": "Usuario atualizado com sucesso",
  "refreshToken": "<jwt>",
  "acessToken": "<jwt>"
}
```

#### POST `/users/refresh`

Envie o refresh token no mesmo header de autorização:

```
Authorization: Bearer <refresh_token>
```

**Resposta 201:**
```json
{ "refreshToken": "<novo_jwt>", "acessToken": "<novo_jwt>" }
```

**Resposta 401** se o token estiver expirado, inválido, ou não corresponder ao armazenado no usuário.

#### GET `/users/` *(requer access token)*

**Resposta 200:** documento do usuário autenticado, apenas com os campos "id nome email role"

```json
{
  "_id": "...",
  "nome": "Jonh Doe",
  "email": "jonhdoe@email.com",
  "role": "user"
}
```

#### PATCH `/users/` *(requer access token)*

Envie apenas os campos que deseja alterar.

```json
{
  "nome": "Jane Doe",
  "email": "novo@email.com",
  "password": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

**Regras:**
- `confirmPassword` é obrigatório quando `password` é enviado, e deve ser idêntico a ele.
- O novo email não pode estar em uso por outro usuário.
- A nova senha não pode ser igual à senha atual.
- Pelo menos um campo precisa representar uma mudança real; caso contrário, retorna 400.

**Resposta 200:**
```json
{ "message": "Alteração feita com sucesso" }
```

#### DELETE `/users/` *(requer access token)*

Remove a conta do usuário autenticado e todas as tarefas associadas a ela.

**Resposta 200:**
```json
{ "message": "Usuario deletado com sucesso" }
```

#### GET `/users/logout` *(requer access token)*

Invalida o refresh token atual do usuário.

**Resposta 200:**
```json
{ "message": "Logout realizado com sucesso" }
```

## Rotas — Tarefas (`/tarefas`)

Todas as rotas exigem access token e operam apenas sobre as tarefas do usuário autenticado.

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

**Resposta 201:** objeto da tarefa criada, com `concluida: false` por padrão.

#### GET `/tarefas/`

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

#### GET `/tarefas/:id`

**Resposta 404** se a tarefa não existir ou pertencer a outro usuário.

#### PATCH `/tarefas/:id`

Envie apenas os campos a alterar (`titulo`, `descricao` e/ou `concluida`). Campos iguais ao valor atual são ignorados.

```json
{
  "titulo": "Novo título"
}
```

**Resposta 400** se nenhuma mudança real for detectada.

#### DELETE `/tarefas/:id`

Remove a tarefa e retorna o objeto deletado.

**Resposta 404** se não encontrada ou pertencer a outro usuário.

## Rotas — Administração (`/adm`)

Todas as rotas exigem access token de um usuário com `role: "admin"`.

| Método | Rota             | Descrição                                               |
|--------|------------------|---------------------------------------------------------|
| GET    | `/users`         | Lista todos os usuários (`id`, `nome`, `email`, `role`) |
| GET    | `/users/:id`     | Retorna um usuário e suas tarefas                       |
| DELETE | `/users/:id`     | Remove um usuário e todas as suas tarefas               |

**Resposta 403** se o usuário autenticado não tiver `role: "admin"`.

#### GET `/adm/users/:id`

**Resposta 200:**
```json
{
  "user": { "nome": "...", "email": "...", "role": "user" },
  "tarefas": [ { "titulo": "...", "descricao": "...", "concluida": false } ]
}
```

## Formato de erros de validação

Erros de corpo de requisição e de parâmetro `:id` seguem o mesmo formato, retornado com status **400**:

```json
{
  "errors": [
    { "field": "email", "message": "Insira um email valido" }
  ]
}
```

## Códigos de resposta

| Código | Significado                                   |
|--------|-----------------------------------------------|
| 200    | Sucesso                                       |
| 201    | Recurso criado / operação concluída           |
| 400    | Dados inválidos ou sem alterações detectadas  |
| 401    | Token ausente, inválido ou expirado           |
| 403    | Usuário autenticado sem permissão (rota admin)|
| 404    | Recurso não encontrado                        |
| 500    | Erro interno do servidor                      |

## Licença

Distribuído sob a licença ISC. Veja o campo `license` em `package.json`.

---

Desenvolvido por **JPTirso**.