const express = require("express");
const router = express.Router();

const controller = require("../controllers/users.controller");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/perm.middleware")

router.post("/registro", controller.registro);

router.post("/login", controller.login);

router.get("/teste", auth, admin, controller.testeAuth);

router.patch("/", auth, controller.update)

module.exports = router;
