require('dotenv').config();
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite al backend entender formatos JSON en el body

// Importar Rutas
const clientesRouter = require('./controllers/cliente');
const ordenesRouter = require('./controllers/orden');
const panesRouter = require('./controllers/pan');
const empleadosRouter = require('./controllers/empleado');

// Vincular Rutas a la Aplicación
app.use('/api', clientesRouter);
app.use('/api', ordenesRouter);
app.use('/api', panesRouter);
app.use('/api', empleadosRouter);

// Ruta de prueba de salud del sistema
app.get('/', (req, res) => {
    res.send('Backend de Panadería Las Rosas funcionando de manera correcta.');
});

// Encender Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


//Entonces para acceder a esto mediante el front sería algo como http://localhost:3000/api/clientes para obtener la lista de clientes, http://localhost:3000/api/panes para obtener la lista de panes, etc.