async function admPerm(req, res ,next) {
    const perm = req.userRole 
    if(perm !== "admin"){
        return res.status(403).json({message: "Usuario não autorizado"})
    }

    next()
}

module.exports = admPerm