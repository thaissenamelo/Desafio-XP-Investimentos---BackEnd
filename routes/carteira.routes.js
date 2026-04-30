const express = require('express');
const router = express.Router();
const carteiraController = require('../controllers/carteira.controller');


router.post('/investimento/comprar', carteiraController.comprarAtivo);
router.post('/investimento/vender', carteiraController.venderAtivo);
router.get('/:codCliente', carteiraController.getCarteiraCliente);

module.exports = router;