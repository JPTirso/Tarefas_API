const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

class UsersController {
  async registro(req, res) {
    const { nome, email, password, confirmPassword } = req.body;
    if (!nome || nome.trim() === "") {
      return res.status(400).json({ message: "Digite um nome valido" });
    }
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Digite um email valido" });
    }
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({ message: "Email ja cadastrado" });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Digite uma senha valida" });
    }
    if (!confirmPassword || confirmPassword.trim() === "") {
      return res.status(400).json({ message: "Confirme sua senha" });
    }
    if (confirmPassword !== password) {
      return res
        .status(400)
        .json({ message: "A senha confirmada é diferente da senha posta" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const novoUsuario = await User.create({
        nome,
        email,
        password: passwordHash,
      });
      res.status(201).json({ message: "Usuario criado com sucesso" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}

module.exports = new UsersController();
