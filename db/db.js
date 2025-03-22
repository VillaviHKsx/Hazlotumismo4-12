import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://hsoledispa5:BSChstl3t3rn1dad@clusterbackend3rahv.podkv.mongodb.net/hazlotumismo414?appName=ClusterBackend3raHV');
        console.log('Conectado a la base de datos MongoDB');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
}