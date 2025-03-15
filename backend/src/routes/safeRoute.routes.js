const express = require('express');
const { calculateSafeRoute } = require('../controllers/safeRoute.controller');

const router = express.Router();

// POST endpoint to calculate a safe route
router.post('/', calculateSafeRoute);

module.exports = router;

