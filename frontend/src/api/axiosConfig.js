import axios from 'axios';

const api = axios.create({
    // Empty baseURL — requests go to the same host/port
    // In dev: Vite proxy forwards /library → localhost:8080
    // In prod: Nginx proxy forwards /library → app:8080
    baseURL: import.meta.env.VITE_API_BASE_URL || '/library'
});

export default api;