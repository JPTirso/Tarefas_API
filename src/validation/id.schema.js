const { z } = require("zod")
const mongoose = require("mongoose")

const idSchema = z.string({ message: "Informe o id do usuario" }).refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  { message: "Id do usuario é invalido" },
);

module.exports = idSchema