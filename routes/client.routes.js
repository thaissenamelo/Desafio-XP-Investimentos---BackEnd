const express = require('express');
const router = express.Router();
;
const clientController = require('../controllers/cliente.controller');

router.post('/',clientController.createClient)
router.get('/',clientController.getAllClients)
router.get('/:id',clientController.getClient)
router.put('/:id',clientController.updateClient)
router.delete('/:id',clientController.deleteClient)




module.exports = router