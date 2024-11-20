import React, { useState, useEffect, useRef } from 'react';
import {
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    TextField,
    Container,
    Button
} from '@mui/material';

import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SupportDashboard = () => {
    const [socket, setSocket] = useState(null);
    const [activeChats, setActiveChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user?.token) {
            navigate('/login');
            return;
        }

        console.log('Admin socket bağlantısı kuruluyor...');
        const newSocket = io(`${process.env.REACT_APP_SOCKET_URL}/support`, {
            auth: { token: user.token },
            transports: ['websocket'],
            forceNew: true
        });

        newSocket.on('connect', () => {
            console.log('Admin socket bağlantısı başarılı:', newSocket.id);
            setConnected(true);
            newSocket.emit('admin_join');
        });

        newSocket.on('new_chat', (chat) => {
            console.log('Yeni sohbet alındı:', chat);
            setActiveChats(prev => {
                if (!prev.some(c => c._id === chat._id)) {
                    return [chat, ...prev];
                }
                return prev;
            });
            toast(`Yeni sohbet talebi: ${chat.name}`);
        });

        newSocket.on('new_message', (data) => {
            console.log('Yeni mesaj alındı:', data);
            
            // Aktif sohbetleri güncelle
            setActiveChats(prev => {
                return prev.map(chat => {
                    if (chat._id === data.chatId) {
                        const updatedMessages = [...(chat.messages || [])];
                        if (!updatedMessages.some(m => m._id === data.message._id)) {
                            updatedMessages.push(data.message);
                        }
                        return {
                            ...chat,
                            messages: updatedMessages,
                            lastMessage: new Date(data.message.createdAt)
                        };
                    }
                    return chat;
                });
            });

            // Seçili sohbeti güncelle
            if (selectedChat?._id === data.chatId) {
                setSelectedChat(prev => {
                    const updatedMessages = [...(prev.messages || [])];
                    if (!updatedMessages.some(m => m._id === data.message._id)) {
                        updatedMessages.push(data.message);
                        return {
                            ...prev,
                            messages: updatedMessages,
                            lastMessage: new Date(data.message.createdAt)
                        };
                    }
                    return prev;
                });
            }

            // Yeni mesaj bildirimi (sadece kullanıcı mesajları için)
            if (data.message.sender === 'user') {
                toast(`Yeni mesaj: ${data.message.content.substring(0, 30)}${data.message.content.length > 30 ? '...' : ''}`);
            }
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Aktif sohbetleri yükle
        loadActiveChats();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);

    // Aktif sohbetleri yükleme fonksiyonu
    const loadActiveChats = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/support/chats`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            console.log('Aktif sohbetler yüklendi:', data);
            setActiveChats(data.filter(chat => chat.status !== 'closed'));
        } catch (err) {
            console.error('Sohbet listesi yüklenirken hata:', err);
            toast.error('Sohbet listesi yüklenemedi');
        }
    };

    // Mesaj gönderme fonksiyonu
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat || !socket) return;

        console.log('Admin mesajı gönderiliyor:', {
            chatId: selectedChat._id,
            message: message.trim()
        });

        socket.emit('admin_message', {
            chatId: selectedChat._id,
            message: message.trim()
        });

        // Mesajı UI'da hemen göster
        const newMessage = {
            content: message.trim(),
            sender: 'admin',
            senderId: user.id,
            createdAt: new Date(),
            _id: Date.now().toString() // Geçici ID
        };

        setSelectedChat(prev => ({
            ...prev,
            messages: [...(prev.messages || []), newMessage]
        }));

        setMessage('');
    };

    // Otomatik scroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChat?.messages]);

    // Sohbet seçme fonksiyonu
    const handleChatSelect = async (chat) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/support/chats/${chat._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );
            const fullChat = await response.json();
            setSelectedChat(fullChat);
            
            // Seçili sohbetin mesajlarını activeChats'te de güncelle
            setActiveChats(prev => 
                prev.map(c => 
                    c._id === chat._id 
                        ? { ...c, messages: fullChat.messages }
                        : c
                )
            );
        } catch (error) {
            console.error('Sohbet detayı yüklenirken hata:', error);
            toast.error('Sohbet detayı yüklenemedi');
        }
    };

    // Sohbet sonlandırma fonksiyonu
    const handleEndChat = async (chatId) => {
        try {
            if (!socket) return;

            socket.emit('end_chat', { chatId });
            
            // UI'ı güncelle
            setActiveChats(prevChats => 
                prevChats.filter(chat => chat._id !== chatId)
            );
            
            if (selectedChat?._id === chatId) {
                setSelectedChat(null);
            }

            toast.success('Sohbet sonlandırıldı');
        } catch (error) {
            console.error('Sohbet sonlandırma hatası:', error);
            toast.error('Sohbet sonlandırılamadı');
        }
    };

    // Mesajları render etme fonksiyonu
    const renderMessages = (messages = []) => {
        return messages.map((msg, index) => {
            const isAdmin = msg.sender === 'admin';
            const isSystem = msg.sender === 'system';
            
            return (
                <Box
                    key={msg._id || index}
                    sx={{
                        display: 'flex',
                        justifyContent: isAdmin ? 'flex-end' : isSystem ? 'center' : 'flex-start',
                        mb: 2
                    }}
                >
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: isSystem 
                                ? 'grey.200' 
                                : isAdmin 
                                    ? 'primary.main' 
                                    : 'grey.100',
                            color: isAdmin ? 'white' : 'text.primary',
                            maxWidth: '70%'
                        }}
                    >
                        <Typography variant="body1">
                            {msg.content}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                display: 'block', 
                                mt: 0.5, 
                                opacity: 0.7,
                                color: isAdmin ? 'white' : 'text.secondary'
                            }}
                        >
                            {new Date(msg.createdAt).toLocaleTimeString()}
                        </Typography>
                    </Paper>
                </Box>
            );
        });
    };

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2} sx={{ height: 'calc(100vh - 100px)' }}>
                {/* Sol panel - Aktif sohbetler listesi */}
                <Grid item xs={3}>
                    <Paper sx={{ height: '100%', overflow: 'auto' }}>
                        <List>
                            {activeChats.map(chat => (
                                <ListItem 
                                    key={chat._id}
                                    button 
                                    onClick={() => handleChatSelect(chat)}
                                    selected={selectedChat?._id === chat._id}
                                    sx={{
                                        backgroundColor: chat.messages?.some(m => 
                                            m.sender === 'user' && 
                                            !m.read && 
                                            (!selectedChat || selectedChat._id !== chat._id)
                                        ) ? 'action.hover' : 'inherit'
                                    }}
                                >
                                    <ListItemText
                                        primary={chat.name}
                                        secondary={`Son mesaj: ${new Date(chat.lastMessage || chat.createdAt).toLocaleString()}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Sağ panel - Seçili sohbet */}
                <Grid item xs={9}>
                    {selectedChat ? (
                        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Sohbet başlığı */}
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    {selectedChat.name} ile sohbet
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleEndChat(selectedChat._id)}
                                >
                                    Sohbeti Sonlandır
                                </Button>
                            </Box>

                            {/* Mesajlar alanı */}
                            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                                {renderMessages(selectedChat.messages)}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Mesaj gönderme formu */}
                            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                                <form onSubmit={handleSendMessage}>
                                    <TextField
                                        fullWidth
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Mesajınızı yazın..."
                                        variant="outlined"
                                        size="small"
                                    />
                                </form>
                            </Box>
                        </Paper>
                    ) : (
                        <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                Sohbet seçilmedi
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SupportDashboard; 