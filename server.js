const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://www.gstatic.com",
                "https://apis.google.com"
            ],
            frameSrc: [
                "'self'",
                "https://simple-memory-games.firebaseapp.com",
                "https://simple-memory-games.web.app",
                "https://accounts.google.com"
            ],
            connectSrc: [
                "'self'",
                "https://simple-memory-games.firebaseapp.com",
                "https://simple-memory-games.web.app",
                "https://identitytoolkit.googleapis.com",
                "https://*.googleapis.com"
            ],
            imgSrc: ["'self'", "data:", "https:"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:", "https:"]
        }
    }
}));

app.use(compression());

app.use(express.static(path.join(__dirname, './')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});