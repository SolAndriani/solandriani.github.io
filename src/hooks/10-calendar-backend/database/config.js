const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log('DB Online');
  } catch (error) {
    console.error('Error conectando a la BD:', error.message);
    throw new Error('Error a la hora de inicializar BD');
  }
}

module.exports = {
  dbConnection
}