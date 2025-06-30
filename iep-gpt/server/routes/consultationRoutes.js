const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

// Get consultations by student ID
router.get('/student/:studentId', consultationController.getConsultationsByStudentId);

// Create a new consultation
router.post('/', consultationController.createConsultation);

// Update a consultation
router.put('/:id', consultationController.updateConsultation);

module.exports = router;
