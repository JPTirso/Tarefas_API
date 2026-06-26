const express = require("express");

const router = express.Router();

const controller = require("../controllers/tarefas.controller");
const auth = require("../middleware/auth.middleware");
const validation = require("../middleware/validation.middleware");
const tarefaSchema = require("../validation/tarefa.schema");

router.post("/", auth, validation(tarefaSchema.create), controller.create);

router.get("/", auth, controller.index);

router.get("/:id", auth, controller.show);

router.delete("/:id", auth, controller.delete);

router.patch("/:id", auth, validation(tarefaSchema.update), controller.update);

module.exports = router;
