const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const startDB = require("./src/database/connection");

const tarefasRoutes = require("./src/routes/tarefas.routes");
const usersRoutes = require("./src/routes/users.routes");

app.use(express.json());
startDB();

app.use("/tarefas", tarefasRoutes);

app.use("/users", usersRoutes);

const port = 3939;

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
