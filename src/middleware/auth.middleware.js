const jwt = require("jsonwebtoken")

function auth (req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).json({message: "Token não encontrado"})
    }
    const token = authHeader.split(" ")[1]
    try{

        const decoded = jwt.verify(token, process.env.ACESSSECRET)
        req.userId = decoded.id
        req.userRole = decoded.role

        next()
    }catch(error){
        console.log(error)
        if (error.name == "TokenExpiredError"){

        }
          return res.status(401).json({ message: "Token invalido" });
    }
}

module.exports = auth