import express from 'express';
import { User } from '../models/PersonModels.js';

const router = express.Router();

//Vamos a crear el sericio que nos permite inserta un usuario
//POST -> nos permite crear un nuevo recurso
router.post('/', async(req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    }catch (error){
        res.status(500).send(error)
    }
});


//Crear un servicio para listar todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error al listar los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
});

export default router;