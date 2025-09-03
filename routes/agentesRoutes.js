const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

router.get('/', agentesController.index);
router.get('/:id', agentesController.show);
router.post('/', agentesController.create);
router.put('/:id', agentesController.update);
router.patch('/:id', agentesController.partialUpdate);
router.delete('/:id', agentesController.remove);

// Bonus endpoint
router.get('/:id/casos', agentesController.getCasosByAgente);

module.exports = router;