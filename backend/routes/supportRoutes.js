const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SupportChat = require('../models/SupportChat');

// Admin: Tüm aktif sohbetleri getir
router.get('/chats', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Yetkisiz erişim' });
        }

        const chats = await SupportChat.find({ status: { $ne: 'closed' } })
            .sort({ lastMessage: -1, createdAt: -1 });
        
        res.json(chats);
    } catch (error) {
        console.error('Sohbet listesi hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Admin: Sohbet detayını getir
router.get('/chats/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Yetkisiz erişim' });
        }

        const chat = await SupportChat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Sohbet bulunamadı' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Sohbet detayı hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// routes/supportRoutes.js
router.get('/tickets', auth, async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.query;
        const query = {};
        
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;
        
        const tickets = await SupportChat.find(query)
            .sort('-createdAt')
            .populate('assignedTo', 'name email');
            
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Ticket listesi alınamadı' });
    }
});

router.put('/tickets/:id/assign', auth, async (req, res) => {
    try {
        const ticket = await SupportChat.findByIdAndUpdate(
            req.params.id,
            { 
                assignedTo: req.body.adminId,
                status: 'active'
            },
            { new: true }
        );
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Ticket ataması başarısız' });
    }
});

// Sohbet sonlandırma
router.put('/chats/:id/end', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Yetkisiz erişim' });
        }

        const chat = await SupportChat.findByIdAndUpdate(
            req.params.id,
            { status: 'closed' },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ error: 'Sohbet bulunamadı' });
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Sohbet silme
router.delete('/chats/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Yetkisiz erişim' });
        }

        const chat = await SupportChat.findByIdAndDelete(req.params.id);

        if (!chat) {
            return res.status(404).json({ error: 'Sohbet bulunamadı' });
        }

        res.json({ message: 'Sohbet başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router; 