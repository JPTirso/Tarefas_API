const express = require("express");

const router = express.Router();

const controller = require("../controllers/adm.controller");
const auth = require("../middleware/auth.middleware");
const perm = require("../middleware/perm.middleware");
const validation = require("../middleware/validation.middleware");
const userSchema = require("../validation/user.schema");

router.get("/users", auth, perm, controller.Index);

router.get("/users/:id", auth, perm, validation.id, controller.viewUser);

module.exports = router;
