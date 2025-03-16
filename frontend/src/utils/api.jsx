// filepath: c:\Users\swabi\projects\CodeForge\frontend\src\utils\api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;