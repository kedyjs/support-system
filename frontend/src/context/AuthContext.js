import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // LocalStorage'dan kullanıcı bilgilerini al
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                const parsedUser = JSON.parse(storedUser);
                // Token'ı da user nesnesine ekle
                parsedUser.token = storedToken;
                setUser(parsedUser);
                console.log('Stored user loaded:', parsedUser); // Debug log
            }
        } catch (error) {
            console.error('Kullanıcı bilgileri yüklenirken hata:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (userData, token) => {
        try {
            if (!userData || !token) {
                throw new Error('Geçersiz kullanıcı bilgileri veya token');
            }

            // Token'ı userData nesnesine ekle
            const userWithToken = {
                ...userData,
                token: token
            };

            // State'i güncelle
            setUser(userWithToken);
            
            // LocalStorage'a kaydet
            localStorage.setItem('user', JSON.stringify(userWithToken));
            localStorage.setItem('token', token);
            
            console.log('Login successful:', userWithToken); // Debug log
            
            toast.success('Giriş başarılı!');
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Login işlemi hatası:', error);
            toast.error('Giriş işlemi sırasında bir hata oluştu');
            
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const logout = () => {
        // State'i temizle
        setUser(null);
        
        // LocalStorage'ı temizle
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Bildirim göster
        toast.success('Çıkış yapıldı');
        
        // Ana sayfaya yönlendir
        navigate('/', { replace: true });
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 