const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
  getEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento
} = require('../controllers/events');

const router = Router();

// Obtener todos los eventos (no protegido)
router.get('/', getEvento);

// Crear un nuevo evento (protegido)
router.post(
  '/',
  [
    validarJWT, // <-- aquí el JWT
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').not().isEmpty(),
    check('start', 'Fecha de inicio debe ser una fecha válida').isISO8601(),
    check('end', 'Fecha de fin es obligatoria').not().isEmpty(),
    check('end', 'Fecha de fin debe ser una fecha válida').isISO8601(),
    validarCampos
  ],
  crearEvento
);

// Actualizar un evento existente (protegido)
router.put('/:id', validarJWT, actualizarEvento);

// Eliminar un evento (protegido)
router.delete('/:id', validarJWT, eliminarEvento);

module.exports = router;
