require('dotenv').config();
const express = require('express');
const http = require('http');
const SocketService = require('./services/socketService');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/user');
const errorHandler = require('./middleware/error');
const mongoose = require('mongoose');
const cors = require('cors');
const supportRoutes = require('./routes/supportRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);

// CORS ayarları
const corsOptions = {
    origin: ['http://localhost:3000', process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Pre-flight istekleri için OPTIONS metodunu etkinleştir
app.options('*', cors(corsOptions));

// Güvenlik başlıkları
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/auth', limiter);

// Socket.io servisini başlat
const socketService = new SocketService(server);

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);

// Error Handler
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
