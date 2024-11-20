import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard,
    Settings,
    Logout
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SupportDashboard from '../../pages/admin/SupportDashboard';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        handleCloseUserMenu();
    };

    const handleLogout = () => {
        handleCloseUserMenu();
        logout();
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo/Brand - Desktop */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        LOGO
                    </Typography>

                    {/* Mobile Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={() => handleMenuClick('/')}>
                                <Typography textAlign="center">Ana Sayfa</Typography>
                            </MenuItem>
                            {user && (
                                <MenuItem onClick={() => handleMenuClick('/dashboard')}>
                                    <Typography textAlign="center">Dashboard</Typography>
                                </MenuItem>
                                
                            )}
                            
                        </Menu>
                    </Box>

                    {/* Logo/Brand - Mobile */}
                    <Typography
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        LOGO
                    </Typography>

                    {/* Desktop Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            component={RouterLink}
                            to="/"
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Ana Sayfa
                        </Button>
                        {user && (
                            <Button
                                component={RouterLink}
                                to="/dashboard"
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Dashboard
                            </Button>
                        )}
                    </Box>

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        {user ? (
                            <>
                                <Tooltip title="Hesap ayarları">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user.name}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => handleMenuClick('/profile')}>
                                        <AccountCircle sx={{ mr: 2 }} />
                                        <Typography textAlign="center">Profil</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMenuClick('/dashboard')}>
                                        <Dashboard sx={{ mr: 2 }} />
                                        <Typography textAlign="center">Dashboard</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMenuClick('/settings')}>
                                        <Settings sx={{ mr: 2 }} />
                                        <Typography textAlign="center">Ayarlar</Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <Logout sx={{ mr: 2 }} />
                                        <Typography textAlign="center">Çıkış Yap</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Giriş Yap
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="outlined"
                                    color="inherit"
                                >
                                    Kayıt Ol
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar; 