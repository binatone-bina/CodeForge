const axios = require('axios');

exports.triggerPanicButton = async (req, res) => {
    const { phoneNumber, message, location } = req.body;

    if (!phoneNumber || !message || !location || !location.latitude || !location.longitude) {
        return res.status(400).json({ error: 'Phone number, message, and location are required.' });
    }

    try {
        // 1️⃣ Send SMS using TextLocal API
        let smsResponse;
        try {
            smsResponse = await axios.post(
                'https://api.textlocal.in/send/',
                new URLSearchParams({
                    apiKey: process.env.TEXTLOCAL_API_KEY,
                    numbers: phoneNumber,
                    message,
                }).toString(),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            console.log('SMS Response:', smsResponse.data);
        } catch (smsError) {
            console.error('Error sending SMS:', smsError.message);
            return res.status(500).json({ error: 'Failed to send SMS.' });
        }

        // 2️⃣ Update location in Firebase Realtime Database
        await admin.database().ref(`locations/${req.user.id}`).set({
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: Date.now(),
        });

        console.log('Location updated successfully in Firebase.');

        res.status(200).json({ success: true, message: 'Panic button triggered successfully.' });
    } catch (error) {
        console.error('Error triggering panic button:', error.message);
        res.status(500).json({ error: 'Failed to trigger panic button.' });
    }
};
