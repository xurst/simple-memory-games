const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName of Object.keys(interfaces)) {
        for (const interface of interfaces[interfaceName]) {
            if (!interface.internal && interface.family === 'IPv4') {
                return interface.address;
            }
        }
    }
    return 'localhost';
};

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://www.gstatic.com",
                "https://apis.google.com",
                "https://cdnjs.cloudflare.com",
                "https://*.firebaseapp.com",
                "https://*.googleapis.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdnjs.cloudflare.com"
            ],
            frameSrc: [
                "'self'",
                "https://*.firebaseapp.com",
                "https://*.google.com",
                "https://simple-memory-games.firebaseapp.com"
            ],
            connectSrc: [
                "'self'",
                "https://*.firebaseapp.com",
                "https://*.googleapis.com",
                "https://identitytoolkit.googleapis.com",
                "wss://*.firebaseio.com",
                "https://*.google.com"
            ],
            imgSrc: ["'self'", "data:", "https:", "https://*.google.com"],
            fontSrc: [
                "'self'",
                "data:",
                "https://cdnjs.cloudflare.com"
            ]
        }
    }
}));

app.use(compression());
app.use(express.static(path.join(__dirname, './')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('\n=== mobile debug server running ===');
    console.log(`local url: http://localhost:${PORT}`);
    console.log(`network url: http://${localIP}:${PORT}`);
    console.log('\nuse the network url for mobile device testing');
    console.log('=====================================');
});