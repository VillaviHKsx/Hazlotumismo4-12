import express from 'express';
import { connectDB } from './db/db.js';
import userRoutes from './routes/user.router.js';


const app = express();

app.use(express.json());

connectDB();

//Vamos a definir nuestro conjunto de rutas
app.use('/users', userRoutes)

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});