import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        darkMode: false,
        twoFactorAuth: false,
        language: 'tr',
    });
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSettingChange = async (setting) => {
        try {
            const newValue = !settings[setting];
            await axios.put('/api/users/settings', {
                [setting]: newValue
            });
            
            setSettings(prev => ({
                ...prev,
                [setting]: newValue
            }));
            
            toast.success('Ayarlar güncellendi');
        } catch (error) {
            toast.error('Ayarlar güncellenirken bir hata oluştu');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.post('/api/users/delete-account', {
                password: confirmPassword
            });
            toast.success('Hesabınız başarıyla silindi');
            // Kullanıcıyı çıkış yap ve ana sayfaya yönlendir
        } catch (error) {
            toast.error(error.response?.data?.error || 'Hesap silinemedi');
        }
        setDeleteAccountDialog(false);
    };

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        aria-label="settings tabs"
                    >
                        <Tab label="Genel" />
                        <Tab label="Bildirimler" />
                        <Tab label="Güvenlik" />
                        <Tab label="Hesap" />
                    </Tabs>
                </Box>

                {/* Genel Ayarlar */}
                <TabPanel value={activeTab} index={0}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Karanlık Mod"
                                secondary="Uygulamanın karanlık temasını aktifleştir"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={settings.darkMode}
                                    onChange={() => handleSettingChange('darkMode')}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Dil"
                                secondary="Uygulama dilini değiştir"
                            />
                            <ListItemSecondaryAction>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        language: e.target.value
                                    }))}
                                    style={{ padding: '8px' }}
                                >
                                    <option value="tr">Türkçe</option>
                                    <option value="en">English</option>
                                </select>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </TabPanel>

                {/* Bildirim Ayarları */}
                <TabPanel value={activeTab} index={1}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Email Bildirimleri"
                                secondary="Önemli güncellemeler için email bildirimleri"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={settings.emailNotifications}
                                    onChange={() => handleSettingChange('emailNotifications')}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Push Bildirimleri"
                                secondary="Anlık bildirimler"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={settings.pushNotifications}
                                    onChange={() => handleSettingChange('pushNotifications')}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </TabPanel>

                {/* Güvenlik Ayarları */}
                <TabPanel value={activeTab} index={2}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="İki Faktörlü Doğrulama"
                                secondary="Hesabınız için ekstra güvenlik"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={settings.twoFactorAuth}
                                    onChange={() => handleSettingChange('twoFactorAuth')}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        İki faktörlü doğrulama aktif olduğunda, her girişte telefonunuza kod gönderilecektir.
                    </Alert>
                </TabPanel>

                {/* Hesap Ayarları */}
                <TabPanel value={activeTab} index={3}>
                    <Typography variant="h6" gutterBottom>
                        Tehlikeli Bölge
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak silinecektir.
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setDeleteAccountDialog(true)}
                    >
                        Hesabı Sil
                    </Button>
                </TabPanel>
            </Paper>

            {/* Hesap Silme Dialog */}
            <Dialog open={deleteAccountDialog} onClose={() => setDeleteAccountDialog(false)}>
                <DialogTitle>Hesabı Sil</DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?
                    </Typography>
                    <TextField
                        fullWidth
                        type="password"
                        label="Şifrenizi onaylayın"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteAccountDialog(false)}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                    >
                        Hesabı Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Settings; 