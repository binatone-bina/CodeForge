const ors = require('openrouteservice-js');

// Initialize OpenRouteService client
const client = new ors.Directions({
    api_key: process.env.ORS_API_KEY, // Ensure ORS_API_KEY is set in your .env file
});

// Controller function to calculate a safe route
exports.calculateSafeRoute = async (req, res) => {
    const { start, end } = req.body; // Expecting start and end coordinates in request body

    if (!start || !end || start.length !== 2 || end.length !== 2) {
        return res.status(400).json({ error: 'Invalid coordinates provided.' });
    }

    try {
        // Call OpenRouteService API to calculate directions
        const directions = await client.calculate({
            coordinates: [start, end], // Pass start and end coordinates
            profile: 'foot-walking',  // Use walking profile for safer routes
            format: 'geojson',        // Response format
        });

        // Return the calculated route as GeoJSON
        res.json(directions);
    } catch (error) {
        console.error('Error calculating safe route:', error.message);
        res.status(500).json({ error: 'Failed to calculate safe route.' });
    }
};
