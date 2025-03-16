import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useAuth } from '@/components/AuthProvider';
import api from '../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
  id: string;
}

const Map = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [liveLocations, setLiveLocations] = useState<Location[]>([]);
  const [safeRoute, setSafeRoute] = useState<any>(null);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log('Current location:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const fetchLiveLocations = async () => {
      try {
        const response = await api.get('/live-location');
        setLiveLocations(response.data.locations);
        console.log('Live locations:', response.data.locations);
      } catch (error) {
        console.error('Error fetching live locations:', error);
      }
    };

    if (isAuthenticated) {
      fetchLiveLocations();
    }
  }, [isAuthenticated]);

  const fetchSafeRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await api.post('/safe-route', { start, end });
      setSafeRoute(response.data);
      console.log('Safe route:', response.data);
    } catch (error) {
      console.error('Error fetching safe route:', error);
    }
  };

  const handleCalculateRoute = () => {
    if (userLocation) {
      const startCoords: [number, number] = [userLocation.lat, userLocation.lng];
      const endCoords: [number, number] = [parseFloat(endLocation.split(',')[0]), parseFloat(endLocation.split(',')[1])];
      fetchSafeRoute(startCoords, endCoords);
    }
  };

  return (
    <div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter end location (lat,lng)"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <button onClick={handleCalculateRoute}>Calculate Safe Route</button>
      </div>
      <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [8.681495, 49.41461]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Render live location markers */}
        {liveLocations.map((location) => (
          <Marker key={location.id} position={[location.lat, location.lng]}>
            <Popup>
              Live Location: {location.lat}, {location.lng}
            </Popup>
          </Marker>
        ))}
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              Your Location: {userLocation.lat}, {userLocation.lng}
            </Popup>
          </Marker>
        )}
        {/* Render safe route */}
        {safeRoute && (
          <Polyline
            positions={safeRoute.features[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])}
            color="blue"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;