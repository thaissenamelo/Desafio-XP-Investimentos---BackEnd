const express = require('express');
const router = express.Router();

const controller = require('../controllers/investimentosController');

router.post('/investimentos/comprar', controller.comprarAtivo);
router.post('/investimentos/vender', controller.venderAtivo);

router.get('/ativos/:codCliente', controller.getCarteiraCliente);
router.get('/ativos/ativo/:codAtivo', controller.getAtivo);

module.exports = router;