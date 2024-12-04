const express = require('express');
const axios = require('axios');
const steamUser = require('steam-user');
const steamTotp = require('steam-totp');

// Configuration
const PORT = process.env.PORT || 3000;
const appUrl = `https://${process.env.RENDER_EXTERNAL_URL || 'your-app.onrender.com'}`;

// Steam credentials
const username = process.env.username;
const password = process.env.password;
const shared_secret = process.env.shared;

const games = [1422450, 1172470, 739630, 730]; // AppIDs of needed games
const status = 1; // 1 = online, 7 = invisible

// Express setup
const app = express();

app.get('/', (req, res) => {
    console.log('Ping received:', new Date().toISOString());
    res.send('App is running!');
});

// Steam client setup
const user = new steamUser();
user.logOn({
    accountName: username,
    password: password,
    twoFactorCode: steamTotp.generateAuthCode(shared_secret),
});

user.on('loggedOn', () => {
    if (user.steamID != null) {
        console.log(`${user.steamID} - Successfully logged on`);
    }
    user.setPersona(status); // Set status to online
    user.gamesPlayed(games); // Play selected games
});

// Self-ping to keep app active
setInterval(() => {
    axios
        .get(appUrl)
        .then(() => console.log('Self-ping successful at:', new Date().toISOString()))
        .catch(err => console.error('Self-ping failed:', err.message));
}, 5 * 60 * 1000); // Ping every 5 minutes

// Heartbeat logging
setInterval(() => {
    console.log('App heartbeat:', new Date().toISOString());
}, 5 * 60 * 1000); // Log every 5 minutes

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.stack || err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
