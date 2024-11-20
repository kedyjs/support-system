const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String, // 'user' veya 'admin'
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Misafir kullanıcılar için null olabilir
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'file'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        name: String,
        size: Number
    }],
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const supportChatSchema = new mongoose.Schema({
    visitorId: {
        type: String,
        required: true // Misafir kullanıcılar için unique ID
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Kayıtlı kullanıcılar için
    },
    name: {
        type: String,
        required: true
    },
    email: String,
    status: {
        type: String,
        enum: ['active', 'waiting', 'closed'],
        default: 'waiting'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Atanan admin
    },
    messages: [messageSchema],
    lastMessage: {
        type: Date,
        default: Date.now
    },
    metadata: {
        browser: String,
        os: String,
        ip: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SupportChat', supportChatSchema); 