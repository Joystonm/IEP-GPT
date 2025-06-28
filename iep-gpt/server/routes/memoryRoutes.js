const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');

// Save student profile and IEP plan
router.post('/save', memoryController.saveStudentData);

// Get student profile by ID
router.get('/student/:id', memoryController.getStudentData);

// Get all student profiles
router.get('/students', memoryController.getAllStudents);

// Update student progress
router.post('/student/:id/progress', memoryController.updateStudentProgress);

// Search for students by name
router.get('/search', memoryController.searchStudents);

module.exports = router;
