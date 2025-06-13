const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const{dbConnection}= require('./database/config')

const app = express();


//Base de datos
dbConnection();



//CORS
app.use(cors())
 

// Directorio público
app.use(express.static('public'));

//Lectura y parsep del body
app.use(express.json());


// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});