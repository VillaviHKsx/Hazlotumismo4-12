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

//Vamos a definir un middleware de tipo PRE -> ANTES
//Antes de guardar el usuario en la BD vamos a hashear el password
userSchema.pre('save', async function(next) {
   //Accedemos al documento actual
   const user = this; //El this hace referencia al documento actual (usuario)

   //Vamos a validar si el password del usuario fue modificado
   //Solamento si es asi vamos a hashear el password
   if (user.isModified('password')) {
    //Ejecutamos la logica
    try {
        //Para encriptar la contraseña vamos a usar bcrypt (ocupamos 2 pasos)
        //Generar una cadena aleatoria que se va a encargar de hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        //Hashear la contraseña
        const hashedPassword = await bcrypt.hash(user.password, salt);
        //Asignamos la contraseña hasheada al password del usuario
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
    } else{
        next();
    }
});

userSchema.post('save', function(user, next) {
    console.log('Usuario guardado con éxito', user);
    next();
});


//Vamos a definir un middleware de tipo POST -> DESPUES
//Despues de hacer un find vamos a quitar el password porque es un dato sensible
userSchema.post('find', function(users, next) {
    //Por cada usuario debo quitar el password
    users.forEach((user) => {
        user.password = undefined;
    });
    next();
});

export const User = mongoose.model('peoples', userSchema);