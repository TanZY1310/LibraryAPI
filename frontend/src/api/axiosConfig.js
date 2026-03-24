import axios from 'axios';

const api = axios.create({
    // Empty baseURL — requests go to the same host/port
    // In dev: Vite proxy forwards /library → localhost:8080
    // In prod: Nginx proxy forwards /library → app:8080
    baseURL: '/library'
});

export default api;