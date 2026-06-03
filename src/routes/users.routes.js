const express = require("express");
const router = express.Router();

const controller = require("../controllers/users.controller");
const auth = require("../middleware/auth.middleware");

router.post("/registro", controller.registro);

router.post("/login", controller.login);

router.get("/teste", auth, controller.testeAuth);

module.exports = router;
