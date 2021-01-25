const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require("../config/settings");
const tokens = require("../config/tokens");

client.on('ready', () => {
    client.users.fetch(settings.ownerId).then(user => {
        user.send(":D");
    }).catch(err=>{
        console.log(err);
    })
});

client.login(tokens.botToken);