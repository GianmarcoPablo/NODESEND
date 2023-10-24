import multer from "multer"
import crypto from "crypto"
import { fileURLToPath } from 'url';
import { dirname } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length)
                cb(null, `${crypto.randomBytes(4).toString("hex")}${extension}`)
            }
        })
    }
    const uploads = multer(configuracionMulter).single("archivo")

    uploads(req, res, async (error) => {
        if (!error) {
            res.json({ archivo: req.file.filename })
        } else {
            console.log(error)
            return next()
        }
    })
}

const eliminarArchivo = async (req, res, next) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log("Archivo eliminado");
    } catch (error) {
        console.log(error);
    }
}


export {
    subirArchivo,
    eliminarArchivo
}