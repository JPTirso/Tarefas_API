const express = require("express");
const app = express();
const dotenv = require("dotenv");
const startDB = require("./src/database/connection")

const tarefasRoutes = require("./src/routes/tarefas.routes");

app.use(express.json());

dotenv.config();
startDB()

app.use(tarefasRoutes);

const port = 3939;

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
