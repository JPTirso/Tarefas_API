const { z } = require("zod");

const userSchema = {
  create: z
    .object(
      {
        nome: z
          .string({ message: "Digite seu nome" })
          .min(3, { message: "O nome deve ter mais de 3 caracteres" })
          .max(100, { message: "O nome deve ter menos de 100 caracteres" }),
        email: z
          .string({ message: "Digite seu email" })
          .email({ message: "Insira um email valido" }),
        password: z
          .string({ message: "Informe a sua senha" })
          .min(6, { message: "A senha deve ter no minimo 6 caracteres" })
          .max(100, { message: "A senha deve ter no maximo 100 caracteres" }),
        confirmPassword: z
          .string({ message: "Confirme a sua senha" })
          .min(6, { message: "A senha deve ter no minimo 6 caracteres" })
          .max(100, { message: "A senha deve ter no maximo 100 caracteres" }),
      },
      { message: "Preencha todos os campos" },
    )
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "As senhas não coincidem.",
    }),
  update: z
    .object({
      nome: z
        .string()
        .min(3, { message: "O nome deve ter mais de 3 caracteres" })
        .max(100, { message: "O nome deve ter menos de 100 caracteres" })
        .optional(),
      email: z.string().email({ message: "Insira um email valido" }).optional(),
      password: z
        .string()
        .min(6, { message: "A senha deve ter no minimo 6 caracteres" })
        .max(100, { message: "A senha deve ter no maximo 100 caracteres" })
        .optional(),
      confirmPassword: z
        .string()
        .min(6, { message: "A senha deve ter no minimo 6 caracteres" })
        .max(100, { message: "A senha deve ter no maximo 100 caracteres" })
        .optional(),
    }, {message: "Insira alguma mudança"})
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "As senhas não coincidem.",
    }),
  login: z.object({
    email: z
      .string({ message: "Digite seu email" })
      .email({ message: "Insira um email valido" }),
    password: z
      .string({ message: "Informe a sua senha" })
      .min(6, { message: "A senha deve ter no minimo 6 caracteres" })
      .max(100, { message: "A senha deve ter no maximo 100 caracteres" }),
  }, {message: "Preencha todos os campos"}),
};

module.exports = userSchema;
