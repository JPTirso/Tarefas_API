const express = require("express");

const router = express.Router();

const controller = require("../controllers/tarefas.controller");
const auth = require("../middleware/auth.middleware");
const validation = require("../middleware/validation.middleware");
const tarefaSchema = require("../validation/tarefa.schema");

router.post("/", auth, validation.body(tarefaSchema.create), controller.create);

router.get("/", auth, controller.index);

router.get("/:id", auth, validation.id, controller.show);

router.delete("/:id", auth, validation.id, controller.delete);

router.patch("/:id", auth, validation.id, validation.body(tarefaSchema.update), controller.update);

module.exports = router;
