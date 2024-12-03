// Import required modules
const steamUser = require('steam-user'); // For Steam bot functionality
const steamTotp = require('steam-totp'); // For generating 2FA codes
const express = require('express'); // For the server to keep the app alive
const axios = require('axios'); // For self-pinging functionality

// Load environment variables
const username = process.env.username;
const password = process.env.password;
const shared_secret = process.env.shared;

const games = [1172470, 739630, 730]; // AppIDs of the games to boost
const status = 1; // 1 - online, 7 - invisible

// Initialize Steam User
const user = new steamUser();
user.logOn({
    accountName: username,
    password: password,
    twoFactorCode: steamTotp.generateAuthCode(shared_secret),
});

// Handle Steam login
user.on('loggedOn', () => {
    if (user.steamID) {
        console.log(`${user.steamID} - Successfully logged on`);
    }
    user.setPersona(status); // Set the user's status
    user.gamesPlayed(games); // Start boosting games
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
        .catch((err) => console.error('Self-ping failed:', err.message));
}, 5 * 60 * 1000); // Ping every 5 minutes

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
