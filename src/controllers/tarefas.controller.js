const crypto = require("crypto");
const Tarefa = require("../models/TarefaModel");

class TarefaController {
  async criarTarefas(req, res) {
    try {
      const novaTarefa = await Tarefa.create(req.body);
      return res.status(201).json(novaTarefa);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  async buscarTarefas(req, res) {
    try {
      const tarefas = await Tarefa.find();
      res.status(200).json(tarefas);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async buscarTarefasById(req, res) {
    try {
      const id = req.params.id;
      const tarefaid = await Tarefa.findById(id);
      if (tarefaid) {
        return res.status(200).json(tarefaid);
      }
      res.status(404).send("Tarefa não encontrada");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deletarTarefa(req, res) {
    try {
      const id = req.params.id;
      const tarefaid = await Tarefa.findByIdAndDelete(id);
      if (tarefaid) {
        return res.status(200).json(tarefaid);
      }
      res.status(404).send("Tarefa não encontrada");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async alterarTarefa(req, res) {
    try {
      const id = req.params.id;
      const update = req.body;
      const tarefaUpdate = await Tarefa.findByIdAndUpdate(id, update, {
        returnDocument: "after",
        runValidators: true,
      });
      if (tarefaUpdate) {
        return res.status(200).json(tarefaUpdate);
      }
      res.status(404).send("Tarefa não encontrada");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}
module.exports = new TarefaController();
