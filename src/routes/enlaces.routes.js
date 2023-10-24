import { Router } from "express"
import { nuevoEnlace, obtenerEnlace } from "../controllers/enlacesController.js";
import { eliminarArchivo } from "../controllers/archivosController.js";
import checkAuth from "../middleware/checkAuth.js";
import { check } from "express-validator"

const router = Router()

router.post("/", [
    check("nombre_original", "Sube un archivo").not().isEmpty(),
    check("nombre", "Sube un archivo").not().isEmpty()
], checkAuth, nuevoEnlace)

router.get("/:url", obtenerEnlace, eliminarArchivo)

export default router;