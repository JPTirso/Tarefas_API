const crypto = require("crypto");

const tarefas = [];

function criarTarefas(req, res) {
  try {
    const tarefa = req.body;
    tarefa.id = crypto.randomUUID();
    tarefa.concluida = false;
    tarefas.push(tarefa);
    return res.status(201).send(`Tarefa ${tarefa.titulo} criada`);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
function buscarTarefas(req, res) {
  try {
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
function buscarTarefasById(req, res) {
  try {
    const id = req.params.id;
    const tarefaid = tarefas.find((tarefa) => tarefa.id == id);
    res.status(200).json(tarefaid);
  } catch (error) {
    res.status(404).send(error.message);
  }
}

module.exports = {
    criarTarefas,
    buscarTarefas,
    buscarTarefasById
}