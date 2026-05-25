const express = require("express");

const router = express.Router();

const TarefaController = require("../controllers/tarefas.controller");

const validarTarefas = require("../middlewares/tarefas.middlewares");

router.post("/tarefas", TarefaController.criarTarefas);

router.get("/tarefas", TarefaController.buscarTarefas);

router.get("/tarefas/:id", TarefaController.buscarTarefasById);

router.delete("/tarefas/:id", TarefaController.deletarTarefa);

router.patch("/tarefas/:id", TarefaController.alterarTarefa);

module.exports = router;
