const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsersController {
  async registro(req, res) {
    try {
      const { nome, email, password, confirmPassword } = req.body;
      const emailExist = await User.findOne({ email: email });
      if (emailExist)
        return res.status(400).json({ message: "Email ja cadastrado" });

      const passwordHash = await bcrypt.hash(password, 10);

      const novoUsuario = await User.create({
        nome,
        email,
        password: passwordHash,
      });

      const refreshToken = jwt.sign(
        {
          id: novoUsuario._id,
        },
        process.env.REFRESHSECRET,
        {
          expiresIn: "30d",
        },
      );

      const acessToken = jwt.sign(
        {
          id: novoUsuario._id,
          role: novoUsuario.role,
        },
        process.env.ACESSSECRET,
        {
          expiresIn: "15min",
        },
      );

      await User.findByIdAndUpdate(
        novoUsuario._id,
        { refreshToken: refreshToken },
        {
          runValidators: true,
        },
      );

      res.status(201).json({
        message: "Usuario criado com sucesso",
        refreshToken: refreshToken,
        acessToken: acessToken,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async login(req, res) {
    const { password, email } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Email ou senha invalidos" });
      }
      const senhaValida = await bcrypt.compare(password, user.password);
      if (!senhaValida) {
        return res.status(404).json({ message: "Email ou senha invalidos" });
      }

      const refreshToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.REFRESHSECRET,
        {
          expiresIn: "30d",
        },
      );

      const acessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.ACESSSECRET,
        {
          expiresIn: "15min",
        },
      );

      await User.findByIdAndUpdate(
        user._id,
        { refreshToken: refreshToken },
        {
          runValidators: true,
        },
      );

      res.status(201).json({
        message: "Usuario atualizado com sucesso",
        refreshToken: refreshToken,
        acessToken: acessToken,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async view(req, res) {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json(user);
  }

  async update(req, res) {
    try {
      const { nome, email, password, confirmPassword } = req.body;
      const id = req.userId;
      const update = {};
      const userAntigo = await User.findById(id);
      if (!userAntigo)
        return res.status(404).json({ message: "Usuario não encontrada" });
      if (nome && userAntigo.nome != nome) {
        update.nome = nome;
      }
      if (email && userAntigo.email != email) {
        const emailExist = await User.findOne({ email: email });
        if (emailExist)
          return res
            .status(400)
            .json({ message: "Já existe um usuario com esse email" });
        update.email = email;
      }
      if (password) {
        const mesmaSenha = await bcrypt.compare(password, userAntigo.password);
        if (mesmaSenha)
          return res
            .status(400)
            .json({ message: "A senha não pode ser igual a anterior" });
        const passwordHash = await bcrypt.hash(password, 10);
        update.password = passwordHash;
      }
      if (Object.keys(update).length === 0)
        return res.status(400).json({ message: "Insira alguma mudança" });
      update.__v = userAntigo.__v + 1;
      await User.findByIdAndUpdate(id, update, {
        returnDocument: "after",
        runValidators: true,
      });
      res.status(200).json({ message: "Alteração feita com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async refresh(req, res) {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ message: "Token não encontrado" });
    }
    const token = tokenHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.REFRESHSECRET);
      const id = decoded.id;
      const user = await User.findById(id);
      if (!user || user.refreshToken != token)
        return res.status(401).json({ message: "Token invalido" });
      const refreshToken = jwt.sign(
        {
          id: id,
        },
        process.env.REFRESHSECRET,
        {
          expiresIn: "30d",
        },
      );

      const acessToken = jwt.sign(
        {
          id: id,
          role: user.role,
        },
        process.env.ACESSSECRET,
        {
          expiresIn: "15min",
        },
      );

      await User.findByIdAndUpdate(
        id,
        { refreshToken: refreshToken },
        {
          runValidators: true,
        },
      );
      res
        .status(201)
        .json({ refreshToken: refreshToken, acessToken: acessToken });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Token invalido" });
    }
  }
  async logout(req, res) {
    const id = req.userId;
    try {
      await User.findByIdAndUpdate(
        id,
        {
          refreshToken: null,
        },
        {
          runValidators: true,
        },
      );

      return res.status(200).json({
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Erro interno",
      });
    }
  }
}

module.exports = new UsersController();
