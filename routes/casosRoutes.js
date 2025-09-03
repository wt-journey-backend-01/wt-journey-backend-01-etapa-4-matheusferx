const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/', casosController.index);
router.get('/:id', casosController.show);
router.post('/', casosController.create);
router.put('/:id', casosController.update);
router.patch('/:id', casosController.partialUpdate);
router.delete('/:id', casosController.remove);

// Bonus endpoint
router.get('/:caso_id/agente', casosController.getAgenteByCaso);

module.exports = router;
