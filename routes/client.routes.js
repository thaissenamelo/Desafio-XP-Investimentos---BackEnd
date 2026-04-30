const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/cliente.controller');

router.post('/', clienteController.createClient);
router.get('/', clienteController.getAllClients);
router.get('/:id', clienteController.getClient);
router.put('/:id', clienteController.updateClient);
router.delete('/:id', clienteController.deleteClient);

module.exports = router;