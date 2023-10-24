import jwt from "jsonwebtoken"
const checkAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (authHeader) {
        //Obtener el token
        const token = authHeader.split(" ")[1];
        //Comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA);
            req.usuario = usuario;
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(401).json({ msg: "No se ha enviado el token" })
    }
    return next();
}

export default checkAuth;