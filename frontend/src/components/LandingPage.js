import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px'
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    padding: '12px',
    backgroundColor: '#1a237e',
    '&:hover': {
        backgroundColor: '#000051',
    },
}));

const LandingPageContainer = styled(Box)({
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
    display: 'flex',
    alignItems: 'center',
});

function LandingPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userName: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                email: formData.email,
                password: formData.password,
                name: formData.userName
            });
            
            if (response.status === 201) {
                toast.success('Kayıt başarılı!');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Kayıt sırasında bir hata oluştu');
        }
    };

    return (
        <LandingPageContainer>
            <Container component="main" maxWidth="xs">
                <StyledPaper elevation={6}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Hoş Geldiniz
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Hesap Oluşturun
                    </Typography>
                    
                    <StyledForm onSubmit={handleRegister}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email Adresi"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Şifre"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Adınız"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Kayıt Ol
                        </StyledButton>
                        
                        <Button
                            fullWidth
                            variant="text"
                            color="primary"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 1 }}
                        >
                            Zaten hesabınız var mı? Giriş yapın
                        </Button>
                    </StyledForm>
                </StyledPaper>
            </Container>
        </LandingPageContainer>
    );
}

export default LandingPage;
