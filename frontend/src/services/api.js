import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
    (config) => {
        const storedAuthStr = localStorage.getItem('auth_data');
        if (storedAuthStr) {
            try {
                const storedAuth = JSON.parse(storedAuthStr);
                if (storedAuth.token) {
                    config.headers['Authorization'] = `Bearer ${storedAuth.token}`;
                }
            } catch (error) {
                // Ignore silent parse errors
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
