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
    if (tarefaid) {
      return res.status(200).json(tarefaid);
    }
    res.status(404).send("Tarefa não encontrada");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

function deletarTarefa(req, res) {
  try {
    const id = req.params.id;
    const indice = tarefas.findIndex((tarefa) => tarefa.id == id);
    if (indice !== -1) {
      tarefas.splice(indice, 1);
      return res.status(200).send("Tarefa deletada");
    }
    res.status(404).send("Tarefa não encontrada");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
function alterarTarefa(req, res) {
  try {
    const id = req.params.id
    const update = req.body
    const indice = tarefas.findIndex((tarefa) => tarefa.id == id);
    if (indice !== -1) {
      if (update.titulo){
        tarefas[indice]["titulo"] = update.titulo
      }
      if (update.descricao){
        tarefas[indice]["descricao"] = update.descricao
      }
      if (update.concluida != undefined){
        tarefas[indice]["concluida"] = update.concluida
      }
      return res.status(200).json(tarefas[indice])
    }
    res.status(404).send("Tarefa não encontrada")
  } catch (error) {
    res.status(500).send(error.message);
  }
}
module.exports = {
  criarTarefas,
  buscarTarefas,
  buscarTarefasById,
  deletarTarefa,
  alterarTarefa,
};
