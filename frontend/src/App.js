import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Box } from '@mui/material';


// Theme
import theme from './styles/theme';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SupportWidget from './components/support/SupportWidget';
import SupportDashboard from './pages/admin/SupportDashboard';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';


    function App() {
        return (
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthProvider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <Navbar />
                            <Box component="main" sx={{ flexGrow: 1 }}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    
                                    {/* Protected Routes */}
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedRoute>
                                                <Dashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/support"
                                        element={
                                            <AdminRoute>
                                                <SupportDashboard />
                                            </AdminRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/settings"
                                        element={
                                            <ProtectedRoute>
                                                <Settings />
                                            </ProtectedRoute>
                                        }
                                    />
                                    
                                    {/* 404 Route */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Box>
                            <Footer />
                        </Box>
                        <Toaster 
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                },
                            }}
                        />
                        <SupportWidget />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        );
    }

export default App;
