const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const TarefaSchema = new Schema({
    id: ObjectId,
    titulo:{
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    concluida:{
        type: Boolean,
        default: false
    }
})

const Tarefa = mongoose.model("Tarefas", TarefaSchema)

module.exports = Tarefa;