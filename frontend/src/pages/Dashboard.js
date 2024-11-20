import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    TrendingUp,
    People,
    AttachMoney,
    Notifications,
    Support as SupportIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/dashboard/stats');
            setStats(response.data.stats);
        } catch (error) {
            toast.error('Veriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const StatCard = useMemo(() => ({ title, value, icon: Icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4">
                            {value}
                        </Typography>
                    </Box>
                    <Icon sx={{ fontSize: 40, color }} />
                </Box>
            </CardContent>
        </Card>
    ), []);

    // Admin için destek kartı
    const SupportCard = useMemo(() => {
        if (user?.role === 'admin') {
            return (
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/admin/support')}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" component="div">
                                    Destek Talepleri
                                </Typography>
                                <SupportIcon color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                onClick={() => navigate('/admin/support')}
                            >
                                Destek Paneline Git
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            );
        }
        return null;
    }, [user?.role, navigate]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">
                    Hoş Geldiniz, {user.name}
                </Typography>
                <IconButton onClick={fetchDashboardData}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Grid container spacing={3}>
                {/* İstatistik Kartları */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Toplam Kullanıcılar"
                        value={stats.totalUsers}
                        icon={People}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Aktif Kullanıcılar"
                        value={stats.activeUsers}
                        icon={TrendingUp}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Toplam Gelir"
                        value={`₺${stats.totalRevenue}`}
                        icon={AttachMoney}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Yeni Kayıtlar"
                        value={stats.newSignups}
                        icon={Notifications}
                        color="#9c27b0"
                    />
                </Grid>

                {/* Grafik */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 400,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Kullanıcı Aktivitesi
                        </Typography>
                        {/* Chart.js grafiği buraya gelecek */}
                    </Paper>
                </Grid>

                {/* Bildirimler */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 400,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Son Bildirimler
                        </Typography>
                        <List>
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={notification.title}
                                            secondary={notification.message}
                                        />
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Admin için destek kartı */}
                {SupportCard}
            </Grid>
        </Container>
    );
}

export default Dashboard; 