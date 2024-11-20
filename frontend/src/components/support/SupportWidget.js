import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Badge,
    Fab,
    Button
} from '@mui/material';
import { ChatBubble, Send, Close } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const SupportWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [chatStarted, setChatStarted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        let socketInstance = null;

        if (isOpen) {
            socketInstance = io(`${process.env.REACT_APP_SOCKET_URL}/support`, {
                transports: ['websocket'],
                forceNew: true
            });

            socketInstance.on('connect', () => {
                console.log('Socket bağlantısı başarılı');
                setSocket(socketInstance);
            });

            socketInstance.on('chat_started', (data) => {
                console.log('Sohbet başlatıldı:', data);
                setChatStarted(true);
                setChatId(data.chatId);
                setMessages(prev => [...prev, {
                    content: data.message,
                    sender: 'system',
                    createdAt: new Date()
                }]);
            });

            socketInstance.on('new_message', (data) => {
                if (data.message.sender === 'admin') {
                    console.log('Admin mesajı alındı:', data);
                    setMessages(prev => [...prev, data.message]);
                }
            });

            socketInstance.on('chat_ended', (data) => {
                setMessages(prev => [...prev, {
                    content: 'Sohbet sonlandırıldı',
                    sender: 'system',
                    createdAt: new Date()
                }]);
                setChatStarted(false);
                setChatId(null);
                toast.info('Sohbet sonlandırıldı');
            });
        }

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
                setSocket(null);
            }
        };
    }, [isOpen]);

    const handleStartChat = (e) => {
        e.preventDefault();
        console.log('handleStartChat çalıştı');
        
        if (!socket) {
            console.error('Socket bağlantısı yok!');
            return;
        }

        if (!name.trim()) {
            toast.error('Lütfen adınızı girin');
            return;
        }

        console.log('Sohbet başlatma isteği gönderiliyor...', {
            name: name.trim(),
            email: email.trim()
        });

        socket.emit('start_chat', {
            name: name.trim(),
            email: email.trim(),
            browser: navigator.userAgent,
            os: navigator.platform
        });
    };

    const handleSendMessage = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        if (!newMessage.trim() || !chatId || !socket) return;

        console.log('Kullanıcı mesajı gönderiliyor:', {
            chatId,
            message: newMessage.trim()
        });

        socket.emit('user_message', {
            chatId: chatId,
            message: newMessage.trim()
        });

        // Mesajı sadece UI'da göster
        setMessages(prev => [...prev, {
            content: newMessage.trim(),
            sender: 'user',
            createdAt: new Date()
        }]);

        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.sender === 'user';
        const isSystem = msg.sender === 'system';
        const isAdmin = msg.sender === 'admin';

        return (
            <Box
                key={msg._id || index}
                sx={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : isSystem ? 'center' : 'flex-start',
                    mb: 2
                }}
            >
                <Paper
                    sx={{
                        p: 1,
                        backgroundColor: isSystem 
                            ? 'grey.200'
                            : isUser 
                                ? 'primary.main' 
                                : 'secondary.light',
                        color: isUser ? 'white' : 'text.primary',
                        maxWidth: '70%'
                    }}
                >
                    <Typography variant="body1">
                        {msg.content}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                    </Typography>
                </Paper>
            </Box>
        );
    };

    return (
        <>
            <Fab
                color="primary"
                onClick={() => setIsOpen(!isOpen)}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {isOpen ? <Close /> : <ChatBubble />}
            </Fab>

            <Paper
                sx={{
                    display: isOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    position: 'fixed',
                    bottom: 80,
                    right: 16,
                    width: 320,
                    height: 480,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">Canlı Destek</Typography>
                </Box>

                {!chatStarted ? (
                    <Box component="form" onSubmit={handleStartChat} sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            label="Adınız"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="E-posta (opsiyonel)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ mt: 2 }}
                        >
                            Sohbeti Başlat
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                                {messages.map((msg, index) => renderMessage(msg, index))}
                                <div ref={messagesEndRef} />
                            </Box>

                            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Mesajınızı yazın..."
                                />
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
        </>
    );
};

export default SupportWidget; 