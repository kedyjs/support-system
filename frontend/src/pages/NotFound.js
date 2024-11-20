import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h1" color="primary" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Sayfa Bulunamadı
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    size="large"
                >
                    Ana Sayfaya Dön
                </Button>
            </Box>
        </Container>
    );
}

export default NotFound; 