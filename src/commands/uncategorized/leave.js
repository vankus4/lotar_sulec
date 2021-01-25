const settings = require("../../config/settings");

module.exports.run = function (msg, bot, options) {
    if (!bot.guilds[msg.guild.id] || !bot.guilds[msg.guild.id].connection) {
        return
    }
    bot.guilds[msg.guild.id].connection.channel.leave();
    delete bot.guilds[msg.guild.id].connection;
}

module.exports.properties = {
    name: "leave",
    description: "makes the bot leave a voice channel",
    usage: "leave",
    blacklist: [],
    useWhitelist: false
}