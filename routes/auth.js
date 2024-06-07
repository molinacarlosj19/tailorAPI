// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    // Check credentials and generate JWT token
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const accessToken = jwt.sign({ username: 'admin' }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;
