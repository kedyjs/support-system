const SupportChat = require('../models/SupportChat');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

class SocketService {
    constructor(server) {
        this.io = require('socket.io')(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                credentials: true
            }
        });
        
        this.adminSockets = new Map();
        this.setupSocketNamespace();
    }

    setupSocketNamespace() {
        const supportNamespace = this.io.of('/support');

        supportNamespace.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    socket.userId = decoded.userId;
                    socket.role = decoded.role;
                } catch (error) {
                    socket.role = 'guest';
                }
            } else {
                socket.role = 'guest';
            }
            next();
        });

        supportNamespace.on('connection', (socket) => {
            console.log('Yeni bağlantı:', socket.id, 'Role:', socket.role);

            socket.on('admin_join', () => {
                if (socket.role === 'admin') {
                    socket.join('admin');
                    this.adminSockets.set(socket.id, socket.userId);
                    console.log('Admin bağlandı:', socket.id);
                }
            });

            socket.on('start_chat', async (data) => {
                try {
                    console.log('Sohbet başlatma isteği:', data);

                    const chat = new SupportChat({
                        visitorId: socket.id,
                        name: data.name || 'Ziyaretçi',
                        email: data.email,
                        status: 'active',
                        metadata: {
                            browser: data.browser,
                            os: data.os
                        },
                        messages: [{
                            content: 'Sohbet başlatıldı',
                            sender: 'system',
                            createdAt: new Date()
                        }]
                    });

                    await chat.save();
                    console.log('Yeni sohbet oluşturuldu:', chat._id);

                    // Kullanıcıyı sohbet odasına ekle
                    socket.join(chat._id.toString());

                    // Tüm adminlere yeni sohbet bildirimi gönder
                    supportNamespace.to('admin').emit('new_chat', chat);

                    // Kullanıcıya onay gönder
                    socket.emit('chat_started', {
                        chatId: chat._id,
                        message: 'Sohbet başlatıldı. Temsilcimiz en kısa sürede size yardımcı olacak.'
                    });
                } catch (error) {
                    console.error('Sohbet başlatma hatası:', error);
                    socket.emit('error', { message: 'Sohbet başlatılamadı' });
                }
            });

            socket.on('admin_message', async (data) => {
                try {
                    console.log('Admin mesajı alındı:', data);
                    const chat = await SupportChat.findById(data.chatId);
                    if (!chat) {
                        console.error('Sohbet bulunamadı:', data.chatId);
                        return;
                    }

                    const message = {
                        content: data.message,
                        sender: 'admin',
                        senderId: socket.userId,
                        createdAt: new Date(),
                        _id: new mongoose.Types.ObjectId()
                    };

                    chat.messages.push(message);
                    chat.lastMessage = new Date();
                    await chat.save();

                    console.log('Admin mesajı gönderiliyor:', {
                        chatId: data.chatId,
                        message: message
                    });

                    // Hem kullanıcıya hem de tüm adminlere mesajı gönder
                    supportNamespace.emit('new_message', {
                        chatId: data.chatId,
                        message: message
                    });
                } catch (error) {
                    console.error('Admin mesaj hatası:', error);
                }
            });

            socket.on('user_message', async (data) => {
                try {
                    console.log('Kullanıcı mesajı alındı:', data);
                    const chat = await SupportChat.findById(data.chatId);
                    if (!chat) {
                        console.error('Sohbet bulunamadı:', data.chatId);
                        return;
                    }

                    const message = {
                        content: data.message,
                        sender: 'user',
                        createdAt: new Date(),
                        read: false,
                        _id: new mongoose.Types.ObjectId()
                    };

                    chat.messages.push(message);
                    chat.lastMessage = new Date();
                    await chat.save();

                    // Tüm adminlere mesajı gönder
                    supportNamespace.to('admin').emit('new_message', {
                        chatId: data.chatId,
                        message: message
                    });
                } catch (error) {
                    console.error('Kullanıcı mesaj hatası:', error);
                }
            });

            socket.on('end_chat', async (data) => {
                try {
                    const chat = await SupportChat.findById(data.chatId);
                    if (!chat) return;

                    chat.status = 'closed';
                    await chat.save();

                    // Hem kullanıcıya hem de adminlere bildirim gönder
                    supportNamespace.to(data.chatId).emit('chat_ended', {
                        chatId: data.chatId,
                        message: 'Sohbet sonlandırıldı'
                    });

                    supportNamespace.to('admin').emit('chat_ended', {
                        chatId: data.chatId
                    });

                    // Kullanıcıyı odadan çıkar
                    const userSocket = Array.from(await supportNamespace.in(data.chatId).allSockets())[0];
                    if (userSocket) {
                        supportNamespace.sockets.get(userSocket).leave(data.chatId);
                    }
                } catch (error) {
                    console.error('Sohbet sonlandırma hatası:', error);
                }
            });

            socket.on('disconnect', () => {
                console.log('Bağlantı koptu:', socket.id);
                this.adminSockets.delete(socket.id);
            });
        });
    }
}

module.exports = SocketService; 