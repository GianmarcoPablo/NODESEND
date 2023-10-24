import { Router } from "express";
import { subirArchivo, eliminarArchivo } from "../controllers/archivosController.js";
import checkAuth from "../middleware/checkAuth.js";


const router = Router()

router.post("/", checkAuth, subirArchivo)

router.delete("/:id", eliminarArchivo)

export default router