const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const express = require('express'); // Add Express for the server

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

// Optional: Uncomment if you want to log in with a second account
// var username2 = process.env.username2;
// var password2 = process.env.password2;
// var shared_secret2 = process.env.shared2;

// var games2 = [730, 440, 570, 304930];
// var status2 = 1;

// const user2 = new steamUser();
// user2.logOn({
//     accountName: username2,
//     password: password2,
//     twoFactorCode: steamTotp.generateAuthCode(shared_secret2),
// });

// user2.on('loggedOn', () => {
//     if (user2.steamID != null) console.log(user2.steamID + ' - Successfully logged on');
//     user2.setPersona(status2);
//     user2.gamesPlayed(games2);
// });

// Add Express server for UptimeRobot
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Steam booster is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
