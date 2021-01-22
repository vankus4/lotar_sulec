const settings = require("../../config/settings");

module.exports.run = function (msg, bot, options) {
    let commands = Object.keys(bot.commands);
    let response = "**list of available commands:**\`\`\`";
    commands.forEach(command =>{
        response += `${command} -> ${bot.commands[command].properties.description} (usage: ${settings.prefix + bot.commands[command].properties.usage})\n`
    });
    response += "\`\`\`";

    msg.channel.send(response);
}

module.exports.properties = {
    name: "help",
    description: "lists all available commands",
    usage: "help",
    blacklist: [],
    useBlacklistAsWhitelist: false
}