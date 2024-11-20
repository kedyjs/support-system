import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AuthService {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    handleError(error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Bir hata oluştu');
        }
        throw error;
    }
}

export default new AuthService(); 