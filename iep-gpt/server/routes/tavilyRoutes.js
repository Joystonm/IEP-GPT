const express = require('express');
const router = express.Router();
const tavilyController = require('../controllers/tavilyController');

// Get educational resources for a student
router.get('/resources/:studentId', tavilyController.getResources);

// Get teaching strategies for a specific learning challenge
router.get('/strategies/:challenge', tavilyController.getStrategies);

module.exports = router;
