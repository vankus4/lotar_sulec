const settings = require("../../config/settings");

module.exports.run = function (reaction, user, bot) {
    return new Promise(function (resolve, reject) {
        let msg = reaction.message;
        let attachment = msg.attachments.first();
        let nomination = {};

        user.send(`You nominated a post in **${msg.guild.name}**. Choose a category:`, attachment).then(sentMsg => {
            return sentMsg.channel.awaitMessages(m => !m.author.bot, { max: 1, time: 2 * 60 * 1000, errors: ["time"] });
        }).then(collected => {
            console.log(collected.first().content);
            nomination.category = collected.first().content;
            return user.send(`short description: (you have 2 minutes to answer)`);
        }).then(sentMsg => {
            return sentMsg.channel.awaitMessages(m => !m.author.bot, { max: 1, time: 2 * 60 * 1000, errors: ["time"] });
        }).then(collected => {
            nomination.description = collected.first().content;
            return bot.client.users.fetch(settings.ownerId);
        }).then(owner => {
            return owner.send(`**ATTENTION!**\nuser ${user.username} wants to nominate a file,\ncategory: ${nomination.category}\ndescription: ${nomination.description}`, msg.attachments.first());
        }).then(sentMsg=>{
            return sentMsg.react("💚");
        }).then(reaction=>{
            return reaction.message.react("💔");
        }).then(reaction => {
            return user.send(`Thank you! Your nomination is now waiting verification.`);
        }).then(sentMsg => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports.properties = {
    name: "⭐",
    description: "nominates an attachment to be permanently included in this bot",
    usage: "react with :star: to a message with an attachment",
    blacklist: [],
    useWhitelist: false
}