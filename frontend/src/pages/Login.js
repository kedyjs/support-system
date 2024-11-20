import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Geçerli bir email adresi giriniz')
        .required('Email zorunludur'),
    password: Yup.string()
        .required('Şifre zorunludur')
});

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                console.log('Login attempt:', { email: values.email });
                
                const response = await axios.post('/auth/login', values);
                console.log('Server response:', response.data);

                const { success, user, token } = response.data;

                if (!success || !token || !user) {
                    throw new Error('Geçersiz sunucu yanıtı');
                }

                // Token'ı user nesnesine ekle
                const userWithToken = {
                    ...user,
                    token: token
                };

                // Login işlemini gerçekleştir
                await login(userWithToken, token);
                
            } catch (error) {
                console.error('Login error:', error);
                toast.error(error.response?.data?.error || 'Giriş başarısız');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Container component="main" maxWidth="xs">
            <Paper 
                elevation={6}
                sx={{
                    marginTop: 8,
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Giriş Yap
                </Typography>
                
                <Box 
                    component="form" 
                    onSubmit={formik.handleSubmit} 
                    sx={{ mt: 1, width: '100%' }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Adresi"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    
                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        name="password"
                        label="Şifre"
                        type="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </Button>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Link component={RouterLink} to="/register" variant="body2">
                            Hesabınız yok mu? Kayıt olun
                        </Link>
                        <Link component={RouterLink} to="/forgot-password" variant="body2">
                            Şifremi unuttum
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login; 