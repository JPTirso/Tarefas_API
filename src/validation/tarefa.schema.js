const { z } = require("zod");
const tarefaSchema = {
  create: z.object(
    {
      titulo: z
        .string({ message: "Digite o titilo da sua tarefa" })
        .min(3, { message: "O titulo deve ter mais de 3 caracteres" })
        .max(75, { message: "O titulo deve ter menos de 75 caracteres" }),
      descricao: z.string().optional(),
    },
    { message: "Preencha os campos obrigatorios" },
  ),
  update: z.object(
    {
      titulo: z
        .string()
        .min(3, { message: "O titulo deve ter mais de 3 caracteres" })
        .max(75, { message: "O titulo deve ter menos de 75 caracteres" })
        .optional(),
      descricao: z.string().optional(),
      concluida: z.boolean().optional()
    },
    { message: "Insira alguma mudança" },
  ),
};

module.exports = tarefaSchema