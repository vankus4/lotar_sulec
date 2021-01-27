const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require("./config/settings");
const tokens = require("./config/tokens");
const fs = require("fs");
const functions = require("./functions/functions.js");

let bot = {};
bot.commands = {};
bot.reactions = {};
bot.guilds = {};
bot.client = client;

console.log("loading commands...");
let commandsFolder = fs.readdirSync(`${__dirname}/commands`);
commandsFolder.forEach(folder => {
    files = fs.readdirSync(`${__dirname}/commands/${folder}`);
    files.forEach(file => {
        let commandFile = require(`./commands/${folder}/${file}`);
        bot.commands[commandFile.properties.name] = commandFile;
    });
});
console.log(`${Object.keys(bot.commands).length} commands loaded`);

console.log("loading reactions...");
let reactionsFolder = fs.readdirSync(`${__dirname}/reactions`);
reactionsFolder.forEach(folder => {
    files = fs.readdirSync(`${__dirname}/reactions/${folder}`);
    files.forEach(file => {
        let reactionFile = require(`./reactions/${folder}/${file}`);
        bot.reactions[reactionFile.properties.name] = reactionFile;
    });
});
console.log(`${Object.keys(bot.reactions).length} reactions loaded`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(settings.prefix)) {
        return
    }
    let commandName = msg.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
    if (functions.commandIsWhitelisted(msg, bot)) {
        let currentdate = new Date()
        console.log(`${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()} ${msg.author.tag}: ${msg.content}`);
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
        })
    } else {
        if (msg.channel.type === "text") {
            msg.delete().then(() => {
                return msg.channel.send(`unknown command, try ${settings.prefix}help`);
            }).then(replyMsg => {
                setTimeout(() => {
                    replyMsg.delete();
                }, settings.temporaryMessageTimer);
            }).catch(err => {
                console.log(err);
            });
        } else {
            msg.channel.send(`unknown command, try ${settings.prefix}help`);
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) { return }
    if (functions.reactionIsWhitelisted(reaction, bot)) {
        bot.reactions[reaction.emoji.name].run(reaction, user, bot).catch(err => {
            if (!err) { return }
            console.log(err);
            reaction.msg.channel.send(err);
        })
    }
});

client.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.cache.get(packet.d.channel_id);
    if (channel.messages.cache.has(packet.d.message_id)) return;
    channel.messages.fetch(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.cache.get(emoji);
        if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
});

client.login(tokens.botToken);