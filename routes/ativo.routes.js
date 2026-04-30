const express = require('express');
const router = express.Router();

const ativoController = require('../controllers/ativo.controller');

router.get('/', ativoController.getAll);

module.exports = router;