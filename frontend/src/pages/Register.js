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
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
}));

const validationSchema = Yup.object({
    name: Yup.string()
        .required('İsim zorunludur')
        .min(2, 'İsim en az 2 karakter olmalıdır'),
    email: Yup.string()
        .email('Geçerli bir email adresi giriniz')
        .required('Email zorunludur'),
    password: Yup.string()
        .min(6, 'Şifre en az 6 karakter olmalıdır')
        .required('Şifre zorunludur'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
        .required('Şifre tekrarı zorunludur'),
});

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('/auth/register', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                });
                toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
                navigate('/login');
            } catch (error) {
                toast.error(error.response?.data?.error || 'Kayıt başarısız');
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <StyledPaper elevation={6}>
                <Typography component="h1" variant="h4" gutterBottom>
                    Kayıt Ol
                </Typography>
                
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="İsim"
                        name="name"
                        autoComplete="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Adresi"
                        name="email"
                        autoComplete="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Şifre"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Şifre Tekrarı"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Kayıt Ol
                    </Button>
                    <Link component={RouterLink} to="/login" variant="body2">
                        Zaten hesabınız var mı? Giriş yapın
                    </Link>
                </Box>
            </StyledPaper>
        </Container>
    );
}

export default Register; 