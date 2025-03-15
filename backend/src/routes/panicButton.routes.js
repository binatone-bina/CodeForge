const express = require('express');
const authenticateToken = require('../middlewares/auth.middleware'); // Middleware for authentication
const { triggerPanicButton } = require('../controllers/panicButton.controller'); // Controller logic

const router = express.Router();

// POST endpoint for Panic Button
router.post('/', authenticateToken, triggerPanicButton);

module.exports = router;
