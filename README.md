# Web Destek Sistemi

Modern ve güvenli bir web uygulaması ile müşteri destek sistemi. React ve Node.js teknolojileri kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### Kullanıcı Yönetimi
- Kullanıcı kaydı ve girişi
- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme (Admin/Kullanıcı)

### Canlı Destek Sistemi
- Gerçek zamanlı sohbet desteği (Socket.IO)
- Dosya ve görsel paylaşımı
- Okundu bilgisi
- Sohbet geçmişi
- Ziyaretçi takibi

### Güvenlik
- XSS koruması
- CORS yapılandırması
- Rate limiting
- Helmet güvenlik başlıkları
- Şifre hash'leme

### Kullanıcı Arayüzü
- Material UI ile modern tasarım
- Responsive tasarım
- Tema desteği
- Toast bildirimleri
- Form validasyonları

## 🛠 Teknolojiler

### Frontend
- React
- Material UI
- Socket.IO Client
- Axios
- Formik & Yup
- React Router
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT
- Bcrypt
- Helmet
- Mongoose

## 💻 Kurulum

### Gereksinimler
- Node.js (v14+)
- MongoDB
- npm veya yarn

### Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

### Backend Kurulumu

```bash
cd backend
npm install
npm start
```

### Ortam Değişkenleri
Frontend (.env):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/support-system
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## 📦 Proje Yapısı

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── backend/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── services/
```

## 🔒 Güvenlik Önlemleri
- Tüm API istekleri için rate limiting
- Güvenli HTTP başlıkları
- XSS ve HPP koruması
- Request boyut limitleri
- CORS yapılandırması
- Güvenli şifre politikası

## 🚦 API Endpoints

### Kimlik Doğrulama
- POST /api/auth/register - Yeni kullanıcı kaydı
- POST /api/auth/login - Kullanıcı girişi

### Kullanıcı İşlemleri
- GET /api/user/me - Kullanıcı bilgileri
- PUT /api/user/me - Kullanıcı güncelleme

### Destek Sistemi
- GET /api/chats - Sohbet listesi
- POST /api/chats - Yeni sohbet başlatma
- DELETE /api/chats/:id - Sohbet silme