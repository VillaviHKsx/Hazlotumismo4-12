import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

//Definimos el schema de nuestro usuario
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    last_name: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
    },
    city: {
        type: String,
        required: [true, 'La ciudad es obligatorio'],
    },
    country: {
        type: String,
        required: [true, 'El Pais es obligatorio'],
    },
    salary: {
        type: Number,
        required: [true, 'El salario es obligatorio'],
    },
});

export const User = mongoose.model('peoples', userSchema);