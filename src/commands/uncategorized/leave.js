const settings = require("../../config/settings");

module.exports.run = function (msg, bot, options) {
    return new Promise(function(resolve, reject){
        if (!msg.guild || !bot.guilds[msg.guild.id] || !bot.guilds[msg.guild.id].connection) {
            return reject("cannot leave from a channel from here");
        }
        bot.guilds[msg.guild.id].connection.channel.leave();
        delete bot.guilds[msg.guild.id].connection;
        resolve();
    });
}

module.exports.properties = {
    name: "leave",
    description: "makes the bot leave a voice channel",
    usage: "leave",
    blacklist: [],
    useWhitelist: false
}