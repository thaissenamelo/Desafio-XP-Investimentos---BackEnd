const express = require('express');
const router = express.Router();

const carteiraController = require('../controllers/carteira.controller');

router.post('/comprar', carteiraController.comprarAtivo);
router.post('/vender', carteiraController.venderAtivo);

router.get('/:codCliente', carteiraController.getCarteiraCliente);
router.get('/ativo/:codAtivo', carteiraController.getAtivo);

module.exports = router;