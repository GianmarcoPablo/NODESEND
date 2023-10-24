import Usuario from "../models/Usuario.js"
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"

const nuevoUsuario = async (req, res) => {
    //express-validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { email, password } = req.body;
    //Evitar usuarios duplicados
    const yaExiste = await Usuario.findOne({ email });
    if (yaExiste) {
        const error = new Error("El usuario ya existe");
        return res.status(400).json({ msg: error.message });
    }
    // objeto creado a partir del modelo
    const usuario = new Usuario(req.body)
    //Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    //Guardar en la base de datos
    try {
        const usuarioAlmacenado = await usuario.save();
        res.json(usuarioAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const autenticarUsuario = async (req, res) => {
    //express-validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            const error = new Error("El usuario no existe");
            return res.status(400).json({ msg: error.message });
        }
        const passCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passCorrecto) {
            const error = new Error("Password incorrecto");
            return res.status(401).json({ msg: error.message });
        }
        //Crear y firmar el JWT
        const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre, }, process.env.SECRETA, { expiresIn: "8h" })
        res.json({ token })
    } catch (error) {
        console.log(error)
    }
}

const usuarioAutenticado = async (req, res) => {
    const { usuario } = req;
    res.json({ usuario })
}

export {
    nuevoUsuario,
    autenticarUsuario,
    usuarioAutenticado
}