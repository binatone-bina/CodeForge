// filepath: c:\Users\swabi\projects\CodeForge\frontend\src\components\UpdateLocation.js
import React, { useState } from 'react';
import api from '../utils/api.jsx';

const UpdateLocation = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleUpdateLocation = async () => {
        try {
            const response = await api.post('/live-location/update-location', { latitude, longitude });
            console.log('Location updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating location:', error.response.data);
        }
    };

    return (
        <div>
            <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" />
            <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" />
            <button onClick={handleUpdateLocation}>Update Location</button>
        </div>
    );
};

export default UpdateLocation;