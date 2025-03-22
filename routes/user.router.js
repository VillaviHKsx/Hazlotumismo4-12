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

//Servicio para consultar productos usando filtros
router.get('/by-filters', async (req, res) =>{
    //Vamos a lograr que los filtros que lleguen en la peticion se envien dinamicamente
    //a la consulta de MongoDB
    //query params -> /by-filters
    //Modelo.find({ price: 500, category: 'Tecnologia'}).skip(0).limit(10);
    try{
        console.log(req.query);
        let queryObject = { ...req.query };
        //Limpieza de los parametros que no nos sirven para los filtros
        //Definir que parametros no forman parte de los filtros
        const withOutFields = ['page', 'limit', 'sort', 'fields'];
        //Logica para eliminar los parametros que no forman parte de los filtros
        withOutFields.forEach((field) => delete queryObject[field]);
        console.log(req.query);
        console.log(queryObject);
        //Vamos a usuar expresiones regulares para poder agregar el simbolo $ a los operadores
        //La expresion regular que vamos a usar se va a encargar de buscar dentro de una cadena
        //los operadores que vamos a definir y cuando los encuentre los vamos a reemplazar de la siguiebte forma
        //price: { gte:200 } -> price: { $gte:200 }
        let queryString = JSON.stringify(queryObject);
        //Vamos a reemplazar en la cadena los operadores que vamos a usar
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        queryObject = JSON.parse(queryString);

        //Vamos a recibir el query param fields para especificar que campos a mostrar en la consu;ta
        //fields
        let selected = '';
        if(req.query.fields){
            selected = req.query.fields.split(',').join(' ');
        }
        console.log(selected);

        //El ordamiento utilizando sort
        let sort = 'first_name';
        console.log(req.query.sort);
        if ( req.query.sort){
            sort = req.query.sort.split(',').join(' ');
        }
        console.log(sort);

        //Vamos a resilver la paginación
        //skip
        //limit
        //page -> obtener los elementos de determinada pagina
        //limit -> cantidad de elementos por pagina
        //Vamos a dar valores por defecto en el caso de que no nos lleguen los parametros
        let limit = req.query.limit || 10;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;
        const users = await User.find(queryObject).select(selected).sort(sort).skip(skip).limit(limit);

        res.send(users);
    } catch (error){
        res.status(500).send(error);
    }
});

//Crear un servicio para listar todos los usuarios
router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (error) {
        console.error('Error al listar los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
});

//Vamos a crear un servicio para obtener un usuario por id
router.get('/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).send({message: 'Usuario no encontrado'});    
        }
        res.send(user);
    } catch (error){
        res.status(500).send(error)
    }
});

//Vamos a crear un servicio para actualizar un usuario por id
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).send({ message: 'Error de validación', errors: error.errors });
        }
        res.status(500).send({ message: 'Error al actualizar el usuario' });
    }
});

//Vamos a crear un servicio para eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send({ message: 'Error al eliminar el usuario' });
    }
});


export default router;