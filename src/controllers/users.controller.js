const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  async login(req, res) {
    const { password, email } = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Digite um email valido" });
    }
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Digite uma senha valida" });
    }
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Email ou senha invalidos" });
      }
      const senhaValida = await bcrypt.compare(password, user.password)
      if (!senhaValida) {
        return res.status(404).json({ message: "Email ou senha invalidos" });
      }
      const token = jwt.sign(
        {
          id: user._id
        },
        process.env.SECRET,
        {
            expiresIn:"7d"
        }
      );
      res.status(200).json({token: token})

    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

 async testeAuth(req, res){
    const user = await User.findById(req.userid)
    res.status(200).json(user, "-password")
  }
}

module.exports = new UsersController();
