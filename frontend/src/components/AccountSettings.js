import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Snackbar } from "@mui/material";

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [notification, setNotification] = useState({ open: false, message: "" });

    useEffect(() => {
        fetch("http://localhost:5000/user/me", {
            headers: { Authorization: localStorage.getItem("token") },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setName(data.name);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleUpdate = () => {
        fetch("http://localhost:5000/user/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ name }),
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setNotification({ open: true, message: "Güncelleme başarılı!" });
            })
            .catch(() => setNotification({ open: true, message: "Güncelleme başarısız!" }));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Hesap Ayarları</Typography>
            {user && (
                <>
                    <TextField
                        label="Ad"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Güncelle
                    </Button>
                </>
            )}
            <Snackbar
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: "" })}
                autoHideDuration={3000}
            />
        </Container>
    );
};

export default AccountSettings;
