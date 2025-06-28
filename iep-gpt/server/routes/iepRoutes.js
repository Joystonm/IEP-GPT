const express = require('express');
const router = express.Router();
const iepController = require('../controllers/iepController');

// Generate a new 7-day learning plan
router.post('/generate', iepController.generateIEP);

// Get a specific IEP plan by ID
router.get('/:id', iepController.getIEP);

// Generate an adapted plan based on student progress
router.post('/adapt/:id', iepController.adaptIEP);

module.exports = router;
