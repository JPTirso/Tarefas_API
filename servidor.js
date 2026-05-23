const express = require("express");
const crypto = require("crypto")
// criando meu servidor
const app = express()

// transformando body em json
app.use(express.json())

const tarefas = []

app.post("/tarefas", (req,res) => {
    try{
        // Tentativa incorreta para sistemas grandes, mas apenas usando a logica
        // const tarefa = req.body
        // if(tarefa.titulo){
        //     do{  
        //         const idExiste = false
        //         const id = Math.random()
        //         tarefa.map((tarefamap) => {
        //             if(tarefamap.id == id){
        //                 idExiste = true
        //             }
        //         })
        //     }while(idExiste)
        //     terefa.id = id
        //     tarefas.push(tarefa)
        // }
        const tarefa = req.body
        if(tarefa.titulo){
            tarefa.id = crypto.randomUUID()
            tarefa.concluida = false
            tarefas.push(tarefa)
            return res.status(201).send(`Tarefa ${tarefa.titulo} criada`)
        }
        res.status(400).send("Titulo não informado")
    }
    catch(error){
        res.status(500).send(error.message)
    }
})
app.get("/tarefas", (req,res)=>{
    try{
        res.status(200).json(tarefas)
    }
    catch(error){
        res.status(500).send(error.message)
    }
})

// botando o servidor pra rodar
const port = 3939;
app.listen(port, () => console.log(`Rodando na porta ${port}`))