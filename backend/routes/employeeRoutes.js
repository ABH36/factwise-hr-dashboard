const express = require('express');
const router = express.Router();
const { getEmployees, getStats, getRecommendations } = require('../controllers/employeeController');

router.get('/', getEmployees);           
router.get('/stats', getStats);         
router.get('/recommend', getRecommendations); 

module.exports = router;