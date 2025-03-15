const express = require('express');
const admin = require('../config/firebase'); // Import Firebase Admin SDK

const router = express.Router();

// POST endpoint to send notifications
router.post('/', async (req, res) => {
    const { token, message } = req.body;

    if (!token || !message) {
        return res.status(400).json({ error: 'Token and message are required.' });
    }

    try {
        // Send notification via FCM
        const response = await admin.messaging().send({
            token,
            notification: {
                title: 'Emergency Alert',
                body: message,
            },
        });

        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error('Error sending notification:', error.message);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

module.exports = router;
