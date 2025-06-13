const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
}, {
  timestamps: true,
});

// Método para modificar el JSON de salida
EventoSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id; // cambiar _id por id
  return object;
});

module.exports = model('Evento', EventoSchema);
