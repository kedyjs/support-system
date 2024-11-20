const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const express = require('express');

module.exports = (app) => {
    // HTTP headers güvenliği
    app.use(helmet());

    // XSS koruması
    app.use(xss());

    // Parameter pollution koruması
    app.use(hpp());

    // Request boyut limiti
    app.use(express.json({ limit: '10kb' }));
}; 