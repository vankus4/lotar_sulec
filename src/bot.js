const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const settings = require("./config/settings");
const tokens = require("./config/tokens");
const fs = require("fs");
const functions = require("./functions/functions.js");
const mongoClient = require("mongodb").MongoClient;

let bot = {};
bot.commands = {};
bot.reactions = {};
bot.guilds = {};
bot.client = client;

mongoClient.connect("mongodb://localhost:27017/").then(async mongoClient => {
    bot.db = mongoClient.db("discord-bot-db");
}).catch(err => {
    console.log(err);
});

functions.log("loading commands...");
let commandsFolder = fs.readdirSync(`${__dirname}/commands`);
commandsFolder.forEach(folder => {
    files = fs.readdirSync(`${__dirname}/commands/${folder}`);
    files.forEach(file => {
        let commandFile = require(`./commands/${folder}/${file}`);
        bot.commands[commandFile.properties.name] = commandFile;
    });
});
functions.log(`${Object.keys(bot.commands).length} commands loaded`);

functions.log("loading reactions...");
let reactionsFolder = fs.readdirSync(`${__dirname}/reactions`);
reactionsFolder.forEach(folder => {
    files = fs.readdirSync(`${__dirname}/reactions/${folder}`);
    files.forEach(file => {
        let reactionFile = require(`./reactions/${folder}/${file}`);
        bot.reactions[reactionFile.properties.name] = reactionFile;
    });
});
functions.log(`${Object.keys(bot.reactions).length} reactions loaded`);

client.on('ready', () => {
    functions.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(settings.prefix)) {
        return
    }
    let commandName = msg.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
    if (functions.commandIsWhitelisted(msg, bot)) {
        functions.log(`${msg.author.tag}: ${msg.content}`);
        let options = msg.content.toLowerCase().slice(settings.prefix.length).split(' ');
        options.shift();
        options = options.join("");
        if (msg.channel.type === "text") {
            msg.delete();
        }
        bot.commands[commandName].run(msg, bot, options).catch(err => {
            if (!err) { return }
            console.log(err);
            msg.channel.send(err);
        });
    } else {
        if (msg.channel.type === "dm") {
            msg.channel.send(`You can only use commands in a guild text channel.`);
        } else {
            msg.channel.send(`unknown command, try ${settings.prefix}help`);
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) { return }
    if (reaction.partial) {
        reaction.fetch().then((fetchedReaction) => {
            client.emit('messageReactionAdd', fetchedReaction, user);
        }).catch(error => {
            console.error('Something went wrong when fetching the message: ', error);
        });
    } else if(bot.reactions.hasOwnProperty(reaction.emoji.name)) {
        bot.reactions[reaction.emoji.name].run(reaction, user, bot).then(resolution => {
            if (resolution) { functions.log(resolution) }
        }).catch(err => {
            if (!err) { return }
            console.error("reaction error", err);
            if (err.length) {
                user.send(err);
            } else {
                user.send("Your submission has now expired.");
            }
        });
    }
});

client.login(tokens.botToken);