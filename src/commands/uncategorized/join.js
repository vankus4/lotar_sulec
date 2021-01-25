const settings = require("../../config/settings");

module.exports.run = function (msg, bot, options) {
    return new Promise(async function (resolve, reject) {
        if (!msg.member || !msg.member.voice || !msg.member.voice.channel) {
            console.log("cannot connect to channel");
            return reject("cannot connect to channel");
        }
        let voiceChannel = msg.member.voice.channel;
        if (!bot.guilds[msg.guild.id]) {
            bot.guilds[msg.guild.id] = {};
        }
        connection = await voiceChannel.join();
        connection.on("error", (error) => {
            console.log("voiceConnection emmited an error");
            console.log(error);
            connection.disconnect();
        });
        bot.guilds[msg.guild.id].connection = connection;
        resolve(connection);
    });
}

module.exports.properties = {
    name: "join",
    description: "joins your voice channel, if one exists",
    usage: "join",
    blacklist: [],
    useWhitelist: false
}