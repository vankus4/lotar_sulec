const settings = require("../config/settings");

module.exports.commandIsWhitelisted = function (msg, bot, commandName = msg.content.toLowerCase().slice(settings.prefix.length).split(' ')[0]) {
    return (bot.commands.hasOwnProperty(commandName) && (msg.guild && (
        (bot.commands[commandName].properties.useWhitelist && bot.commands[commandName].properties.blacklist.includes(msg.guild.id)) ||
        (!bot.commands[commandName].properties.useWhitelist && !bot.commands[commandName].properties.blacklist.includes(msg.guild.id))
    )
    ));
}

module.exports.reactionIsWhitelisted = function (reaction, bot) {
    let reactionName = reaction.emoji.name;
    return (bot.reactions.hasOwnProperty(reactionName) && (reaction.message.guild && (
        (bot.reactions[reactionName].properties.useWhitelist && bot.reactions[reactionName].properties.blacklist.includes(reaction.message.guild.id)) ||
        (!bot.reactions[reactionName].properties.useWhitelist && !bot.reactions[reactionName].properties.blacklist.includes(reaction.message.guild.id))
    )));
}