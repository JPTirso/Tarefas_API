const express = require("express");

const router = express.Router();

const controller = require("../controllers/tarefas.controller");
const auth = require("../middleware/auth.middleware")

router.post("/", auth, controller.create);

router.get("/", auth, controller.index);

router.get("/:id", auth, controller.show);

router.delete("/:id", auth, controller.delete);

router.patch("/:id", auth, controller.update);

module.exports = router;
