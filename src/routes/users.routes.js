const express = require("express");
const router = express.Router();

const controller = require("../controllers/users.controller");
const auth = require("../middleware/auth.middleware");
const validation = require("../middleware/validation.middleware")
const userSchema = require("../validation/user.schema")

router.post("/registro",validation.body(userSchema.create), controller.registro);

router.post("/login", validation.body(userSchema.login), controller.login);

router.get("/", auth, controller.view);

router.patch("/", auth, validation.body(userSchema.update), controller.update);

router.delete("/", auth, controller.delete)

router.post("/refresh", controller.refresh)

router.get("/logout", auth, controller.logout)

module.exports = router;
