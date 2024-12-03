const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const express = require('express'); // Add Express for the server
const axios = require('axios'); // For self-ping functionality

// Environment variables
var username = process.env.username;
var password = process.env.password;
var shared_secret = process.env.shared;

var games = [1172470, 739630, 730]; // AppIDs of the games
var status = 1; // 1 - online, 7 - invisible

// Initialize Steam User
const user = new steamUser();
user.logOn({
    accountName: username,
    password: password,
    twoFactorCode: steamTotp.generateAuthCode(shared_secret),
});

user.on('loggedOn', () => {
    if (user.steamID != null) console.log(user.steamID + ' - Successfully logged on');
    user.setPersona(status); // Set user status
    user.gamesPlayed(games); // Set games to boost
});

// Memory usage logging (every 10 minutes)
setInterval(() => {
    const used = process.memoryUsage();
    console.log(`Memory usage: ${JSON.stringify(used)}`);
}, 10 * 60 * 1000); // Log every 10 minutes

// Add Express server for UptimeRobot
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Steam booster is running!');
});

// Self-ping logic to keep the app alive
setInterval(() => {
    axios.get(`http://localhost:${PORT}`)
        .then(() => console.log('Self-ping successful'))
        .catch((err) => console.error('Self-ping failed:', err));
}, 5 * 60 * 1000); // Ping every 5 minutes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
