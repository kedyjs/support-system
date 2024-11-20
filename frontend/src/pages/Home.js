import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: 'white',
    padding: theme.spacing(15, 0),
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-10px)'
    }
}));

function Home() {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const features = [
        {
            title: 'Modern Tasarım',
            description: 'En son teknolojiler ile geliştirilmiş modern ve responsive tasarımlar.',
            image: '/images/feature1.jpg'
        },
        {
            title: 'Güvenli Altyapı',
            description: 'SSL sertifikası ve güvenlik önlemleri ile verileriniz güvende.',
            image: '/images/feature2.jpg'
        },
        {
            title: '7/24 Destek',
            description: 'Teknik ekibimiz her zaman yanınızda.',
            image: '/images/feature3.jpg'
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <HeroSection>
                <Container>
                    <Typography
                        variant={isMobile ? 'h3' : 'h2'}
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Profesyonel Web Çözümleri
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ mb: 4, opacity: 0.9 }}
                    >
                        Modern ve güvenli web uygulamaları geliştiriyoruz
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/contact')}
                        sx={{ mr: 2 }}
                    >
                        İletişime Geç
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() => navigate('/services')}
                    >
                        Hizmetlerimiz
                    </Button>
                </Container>
            </HeroSection>

            {/* Features Section */}
            <Container sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                    sx={{ mb: 6 }}
                >
                    Özelliklerimiz
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <FeatureCard>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={feature.image}
                                    alt={feature.title}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    bgcolor: 'grey.100',
                    py: 8
                }}
            >
                <Container>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" gutterBottom>
                                Hemen Başlayın
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                paragraph
                            >
                                Profesyonel web çözümlerimiz ile işinizi büyütün.
                                Ücretsiz demo için hemen iletişime geçin.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => navigate('/register')}
                            >
                                Ücretsiz Deneyin
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="/images/cta-image.jpg"
                                alt="Call to action"
                                sx={{
                                    width: '100%',
                                    maxWidth: 500,
                                    height: 'auto',
                                    borderRadius: 2
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

export default Home; 