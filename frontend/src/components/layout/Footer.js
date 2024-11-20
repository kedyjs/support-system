import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Şirket Bilgileri */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Şirket Adı
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Profesyonel web çözümleri ve yazılım hizmetleri sunuyoruz.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="inherit" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="LinkedIn">
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Hızlı Linkler */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Hızlı Linkler
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/about" color="inherit">Hakkımızda</Link>
                            <Link href="/services" color="inherit">Hizmetlerimiz</Link>
                            <Link href="/contact" color="inherit">İletişim</Link>
                            <Link href="/privacy" color="inherit">Gizlilik Politikası</Link>
                            <Link href="/terms" color="inherit">Kullanım Şartları</Link>
                        </Box>
                    </Grid>

                    {/* İletişim Bilgileri */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            İletişim
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn />
                                <Typography variant="body2">
                                    İstanbul, Türkiye
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone />
                                <Typography variant="body2">
                                    +90 (555) 123 45 67
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email />
                                <Typography variant="body2">
                                    info@sirketadi.com
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

                <Typography variant="body2" align="center">
                    © {new Date().getFullYear()} Şirket Adı. Tüm hakları saklıdır.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer; 