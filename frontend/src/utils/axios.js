import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('İstek hatası:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Sunucudan gelen hata yanıtı
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // İstek yapıldı ama yanıt alınamadı
            return Promise.reject({ error: 'Sunucuya ulaşılamıyor' });
        } else {
            // İstek oluşturulurken hata oluştu
            return Promise.reject({ error: 'İstek oluşturulamadı' });
        }
    }
);

export default instance; 