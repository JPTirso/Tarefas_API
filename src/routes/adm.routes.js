const express = require("express");

const router = express.Router();

const controller = require("../controllers/adm.controller");
const auth = require("../middleware/auth.middleware");
const perm = require("../middleware/perm.middleware")

router.get("/users",auth, perm ,controller.Index)

router.get("/users/:id", auth, perm, controller.viewUser)

module.exports = router