import Enlace from "../models/Enlace.js"
import crypto from "crypto"
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"

const nuevoEnlace = async (req, res) => {

    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { usuario } = req
    const { nombre_original } = req.body

    const enlace = new Enlace()
    // generar url amistosa para el cliente
    enlace.url = crypto.randomBytes(6).toString("hex")
    enlace.nombre = crypto.randomBytes(6).toString("hex")
    enlace.nombre_original = nombre_original

    if (usuario) {
        const { descargas, password } = req.body
        //Asignar a enlace un numero de descargas
        if (descargas) {
            enlace.descargas = descargas
        }
        if (password) {
            const salt = await bcrypt.genSalt(10)
            enlace.password = await bcrypt.hash(password, salt)
        }
        enlace.author = usuario.id
    }

    try {
        await enlace.save()
        res.json({ msg: `${enlace.url}` })
    } catch (error) {
        console.log(error);
    }
}

const obtenerEnlace = async (req, res, next) => {
    const { url } = req.params
    const enlace = await Enlace.findOne({ url })
    if (!enlace) {
        const error = new Error("El enlace no existe")
        return res.status(404).json({ msg: error.message })
    }
    res.json({ archivo: enlace.nombre })

    if (enlace.descargas === 1) {
        // Eliminar el archivo
        req.archivo = enlace.nombre
        await Enlace.findOneAndDelete({ url })
        next()
    } else {
        enlace.descargas--
        await enlace.save()
    }

}

export {
    nuevoEnlace,
    obtenerEnlace
}