const Tarefa = require("../models/TarefaModel");
const User = require("../models/UserModel");
class AdmController {
  async Index(req, res) {
    try {
      const users = await User.find({}).select("id nome email role");
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).jso({ message: "Erro interno" });
    }
  }

  async viewUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findById(id).select("nome email role");
      if(!user) return res.status(404).json({message: "Usuario não encontrado"})
      const tarefas = await Tarefa.find({ userId: id }).select(
        "id titulo descricao concluida",
      );
      res.status(200).json({ user: user, tarefas: tarefas });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async deleteUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user)
        return res.status(404).json({ message: "Usuario não encontrado" });
      await Tarefa.deleteMany({ userId: id });
      res.status(200).json({ message: "Usuario deletado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
module.exports = new AdmController();
