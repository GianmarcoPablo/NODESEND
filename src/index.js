import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import enlacesRoutes from "./routes/enlaces.routes.js"
import archivosRoutes from "./routes/archivos.routes.js"

// Crear el servidor
const app = express();

// Habilitar express.json
app.use(express.json())
// Configuración de dotenv
dotenv.config();
// Conexión a la base de datos
conectarDB();

app.use("/api/usuarios", usuariosRoutes)
app.use("/api/enlaces", enlacesRoutes)
app.use("/api/archivos", archivosRoutes)

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});