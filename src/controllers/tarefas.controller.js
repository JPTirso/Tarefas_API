const Tarefa = require("../models/TarefaModel");
const ObjectId = require("mongoose")
class TarefaController {
  async create(req, res) {
    try {
      const userId = req.userId
      const {titulo, descricao} = req.body
      if (!titulo || titulo.trim() == "") return res.status(400).json({message: "Titulo não informado"})
      if (!descricao || descricao.trim() == "") return res.status(400).json({message: "Descrição não informado"})
      const novaTarefa = await Tarefa.create({
        titulo,
        descricao,
        userId: userId
      });
      return res.status(201).json(novaTarefa);
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
  async index(req, res) {
    try {
      const tarefas = await Tarefa.find({userId:req.userId});
      res.status(200).json(tarefas);
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
  async show(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId
      const tarefaid = await Tarefa.findOne({
        _id: id,
        userId: userId
      });
      if (tarefaid) {
        return res.status(200).json(tarefaid);
      }
      res.status(404).json({message : "Tarefa não encontrada"});
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId
      const tarefaid = await Tarefa.findOneAndDelete({
        _id: id,
        userId: userId
      });
      if (tarefaid) {
        return res.status(200).json(tarefaid);
      }
      res.status(404).json({message : "Tarefa não encontrada"});
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId
      const {titulo, descricao, concluida} = req.body
      const update = {}
      const tarefaAntiga = await Tarefa.findOne({
        _id: id,
        userId: userId
      })
      if(!tarefaAntiga) return res.status(404).json({message : "Tarefa não encontrada"});
      if (titulo && titulo.trim() != "" && tarefaAntiga.titulo != titulo){
        update.titulo = titulo
      }
      if (descricao && descricao.trim() != "" && tarefaAntiga.descricao != descricao){
        update.descricao = descricao
      }
      if (concluida && concluida.trim() != ""  && tarefaAntiga.concluida != concluida){
        update.concluida = concluida
      }
      if (Object.keys(update).length === 0) return res.status(400).json({message: "Insira alguma mudança"})
      const __v = 1 + tarefaAntiga.__v
      update.__v = __v
      const tarefaUpdate = await Tarefa.findByIdAndUpdate(id, update, {
        returnDocument: "after",
        runValidators: true,
      });
      res.status(200).json(tarefaUpdate)
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
}
module.exports = new TarefaController();
