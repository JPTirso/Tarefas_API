const mongoose = require("mongoose")

async function startDB() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@teste.jprt5pz.mongodb.net/`)
    .then(()=> console.log("Banco conectado"))
    .catch((error)=>console.log(error))
}

module.exports = startDB