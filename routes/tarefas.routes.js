const express = require("express");

const router = express.Router();

const {
  criarTarefas,
  buscarTarefas,
  buscarTarefasById,
  deletarTarefa,
  alterarTarefa,
} = require("../controllers/tarefas.controller");

const validarTarefas = require("../middlewares/tarefas.middlewares");

router.post("/tarefas", validarTarefas, criarTarefas);

router.get("/tarefas", buscarTarefas);

router.get("/tarefas/:id", buscarTarefasById);

router.delete("/tarefas/:id", deletarTarefa )

router.patch("/tarefas/:id", alterarTarefa)

module.exports = router;