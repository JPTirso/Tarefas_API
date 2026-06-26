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
      const user = await User.findById(id).select("nome email role")
      const tarefas = await Tarefa.find({ userId: id }).select(
        "id titulo descricao concluida",
      );
      res.status(200).json({ user: user, tarefas: tarefas });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
module.exports = new AdmController();
