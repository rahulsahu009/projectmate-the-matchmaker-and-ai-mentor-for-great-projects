import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Optionally attach local storage logic or token here if needed in the future

export default api;
