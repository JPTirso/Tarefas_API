const Tarefa = require("../models/TarefaModel");
const ObjectId = require("mongoose")
class TarefaController {
  async create(req, res) {
    try {
      const {titulo, descricao} = req.body
      if (!titulo || titulo.trim() == "") return res.status(400).json({message: "Titulo não informado"})
      if (!descricao || descricao.trim() == "") return res.status(400).json({message: "Descrição não informado"})
      const novaTarefa = await Tarefa.create({
        titulo,
        descricao
      });
      return res.status(201).json(novaTarefa);
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
  async index(req, res) {
    try {
      const tarefas = await Tarefa.find();
      res.status(200).json(tarefas);
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
  async show(req, res) {
    try {
      const id = req.params.id;
      const tarefaid = await Tarefa.findById(id);
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
      const tarefaid = await Tarefa.findByIdAndDelete(id);
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
      const {titulo, descricao} = req.body
      if (!titulo || titulo.trim() == "") return res.status(400).json({message: "Titulo não informado"})
      if (!descricao || descricao.trim() == "") return res.status(400).json({message: "Descrição não informado"})
      const update = {titulo, descricao};
      const tarefaUpdate = await Tarefa.findByIdAndUpdate(id, update, {
        returnDocument: "after",
        runValidators: true,
      });
      if (tarefaUpdate) {
        return res.status(200).json(tarefaUpdate);
      }
      res.status(404).json({message : "Tarefa não encontrada"});
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Erro interno"});
    }
  }
}
module.exports = new TarefaController();
