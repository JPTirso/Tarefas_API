const jwt = require("jsonwebtoken")

function auth (req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        res.status(401).json({message: "Token não encontrado"})
    }
    const token = authHeader.split(" ")[1]
    try{

        const decoded = jwt.verify(token, process.env.SECRET)
        req.userid = decoded.id

        next()
    }catch(error){
        return res.status(401).json({message: "Token invalido"})
    }
}

module.exports = auth