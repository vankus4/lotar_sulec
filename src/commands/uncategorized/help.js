const settings = require("../../config/settings");
const { commandIsWhitelisted } = require("../../functions/functions.js");

module.exports.run = function (msg, bot, options) {
    return new Promise(function (resolve, reject) {
        let commands = Object.keys(bot.commands);
        let response = "**list of available commands:**\`\`\`";
        commands.forEach(command => {
            if (commandIsWhitelisted(msg, bot, command)) {
                response += `${command} -> ${bot.commands[command].properties.description} (usage: ${settings.prefix + bot.commands[command].properties.usage})\n`
            }
        });
        response += "\`\`\`";

        msg.channel.send(response);
        resolve();
    });
}

module.exports.properties = {
    name: "help",
    description: "lists all available commands",
    usage: "help",
    blacklist: [],
    useWhitelist: false
}