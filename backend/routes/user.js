const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Kullanıcı bilgilerini alma
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Kullanıcı bilgileri alınamadı!" });
    }
});

// Kullanıcı bilgilerini güncelleme
router.put("/me", authMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Güncelleme başarısız!" });
    }
});

module.exports = router;
