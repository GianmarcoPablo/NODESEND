import { Router } from "express";
import { nuevoUsuario, autenticarUsuario, usuarioAutenticado } from "../controllers/usuariosController.js";
import { check } from "express-validator";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.post("/", [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe tener al menos 6 caracteres").isLength({ min: 6 })
], nuevoUsuario);

router.post("/auth", [
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe tener al menos 6 caracteres").isLength({ min: 6 })
], autenticarUsuario)

router.get("/perfil", checkAuth, usuarioAutenticado)

export default router;