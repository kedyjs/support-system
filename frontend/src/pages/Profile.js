import React, { useState } from 'react';
import {
    Container,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
    Typography,
    Box,
    Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('İsim zorunludur')
        .min(2, 'İsim en az 2 karakter olmalıdır'),
    email: Yup.string()
        .email('Geçerli bir email adresi giriniz')
        .required('Email zorunludur'),
    currentPassword: Yup.string()
        .min(6, 'Şifre en az 6 karakter olmalıdır'),
    newPassword: Yup.string()
        .min(6, 'Şifre en az 6 karakter olmalıdır'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmiyor')
});

function Profile() {
    const { user, login } = useAuth();
    const [avatar, setAvatar] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: user.name || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                Object.keys(values).forEach(key => {
                    if (values[key]) formData.append(key, values[key]);
                });
                if (avatar) {
                    formData.append('avatar', avatar);
                }

                const response = await axios.put('/api/users/profile', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                login(response.data.user, response.data.token);
                toast.success('Profil güncellendi!');
            } catch (error) {
                toast.error(error.response?.data?.error || 'Güncelleme başarısız');
            }
        },
    });

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        src={avatar ? URL.createObjectURL(avatar) : user.avatarUrl}
                        sx={{ width: 100, height: 100, mr: 3 }}
                    />
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Profil Bilgileri
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Fotoğraf Değiştir
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                    </Box>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="name"
                                label="İsim"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 3 }}>
                                <Typography color="textSecondary">
                                    Şifre Değiştir
                                </Typography>
                            </Divider>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="currentPassword"
                                label="Mevcut Şifre"
                                type="password"
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="newPassword"
                                label="Yeni Şifre"
                                type="password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="confirmPassword"
                                label="Yeni Şifre (Tekrar)"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Değişiklikleri Kaydet
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}

export default Profile; 