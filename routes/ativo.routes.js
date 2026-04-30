const express = require('express');
const router = express.Router();
const ativoController = require('../controllers/ativo.controller');

router.post('/', ativoController.createAtivo);
router.get('/', ativoController.getAllAtivos);
router.get('/:id', ativoController.getAtivo);
router.put('/:id', ativoController.updateAtivo);
router.delete('/:id', ativoController.deleteAtivo);

module.exports = router;
