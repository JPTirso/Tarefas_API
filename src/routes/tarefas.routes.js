const express = require("express");

const router = express.Router();

const TarefaController = require("../controllers/tarefas.controller");

router.post("/", TarefaController.criarTarefas);

router.get("/", TarefaController.buscarTarefas);

router.get("/:id", TarefaController.buscarTarefasById);

router.delete("/:id", TarefaController.deletarTarefa);

router.patch("/:id", TarefaController.alterarTarefa);

module.exports = router;
