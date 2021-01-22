const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require("./config/settings");
const tokens = require("./config/tokens");
const fs = require("fs");
const path = require("path");

let bot = {};
bot.commands = {};

console.log("loading commands...");
let commandsFolder = fs.readdirSync(`${__dirname}/commands`);
commandsFolder.forEach(folder => {
    files = fs.readdirSync(`${__dirname}/commands/${folder}`);
    files.forEach(file =>{
        let commandName = file.split(".")[0];
        bot.commands[commandName] = require(`./commands/${folder}/${file}`);
    });
});
console.log(`${Object.keys(bot.commands).length} commands loaded`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(settings.prefix)) {
        return
    }
    let commandName = msg.content.toLowerCase().slice(settings.prefix.length).split(' ')[0]; // get the command name
    console.log(commandName);
    if (bot.commands.hasOwnProperty(commandName)){ // if command exists and if is DJ or request is cat/dog
        bot.commands[commandName].run(bot, msg);
    }
});

client.login(tokens.botToken);