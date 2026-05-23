const express = require("express");

const router = express.Router();

const {
  criarTarefas,
  buscarTarefas,
  buscarTarefasById,
} = require("../controllers/tarefas.controller");

const validarTarefas = require("../middlewares/validarTarefas");

router.post("/tarefas", validarTarefas, criarTarefas);

router.get("/tarefas", buscarTarefas);

router.get("/tarefas/:id", buscarTarefasById);

module.exports = router;