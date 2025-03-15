const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(
        path.resolve(__dirname, 'service-account.json') // Path to service account JSON
    ),
    databaseURL: 'https://codeforge-13c23-default-rtdb.firebaseio.com', // Replace <DATABASE_NAME> with your Firebase database name
});

module.exports = admin;
