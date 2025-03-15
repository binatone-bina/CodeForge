const express = require('express');
const admin = require('../config/firebase'); // Import Firebase Admin SDK
const authenticateToken = require('../middlewares/auth.middleware'); // Middleware for authentication

const router = express.Router();

// POST endpoint to update live location
router.post('/update-location', authenticateToken, async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    try {
        // Store location in Firebase Realtime Database under the user's ID
        await admin.database().ref(`locations/${req.user.id}`).set({
            latitude,
            longitude,
            timestamp: Date.now(), // Store the timestamp of the update
        });

        res.status(200).json({ success: true, message: 'Location updated successfully.' });
    } catch (error) {
        console.error('Error updating location:', error.message);
        res.status(500).json({ error: 'Failed to update location.' });
    }
});

module.exports = router;
