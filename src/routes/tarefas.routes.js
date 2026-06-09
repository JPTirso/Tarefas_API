const express = require("express");

const router = express.Router();

const controller = require("../controllers/tarefas.controller");

router.post("/", controller.create);

router.get("/", controller.index);

router.get("/:id", controller.show);

router.delete("/:id", controller.delete);

router.patch("/:id", controller.update);

module.exports = router;
