function validarTarefas(req,res,next){
    const tarefa = req.body
    if(!tarefa.titulo || tarefa.titulo.trim() === ""){
        return res.status(400).send("Titulo não informado")
    }

    next()
}

module.exports = validarTarefas;