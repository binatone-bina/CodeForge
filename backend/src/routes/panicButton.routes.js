router.post('/panic-button', async (req, res) => {
    const { phoneNumber, message, location } = req.body;

    try {
        // Send SMS via TextLocal API
        await axios.post(
            'https://api.textlocal.in/send/',
            new URLSearchParams({
                apiKey: process.env.TEXTLOCAL_API_KEY,
                numbers: phoneNumber,
                message,
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Update location in Firebase Realtime Database
        await admin.database().ref(`locations/${req.user.id}`).set(location);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
