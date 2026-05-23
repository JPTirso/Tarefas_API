const express = require("express");
const app = express();

const tarefasRoutes = require("./routes/tarefas.routes");

app.use(express.json());

app.use(tarefasRoutes);

const port = 3939;

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
