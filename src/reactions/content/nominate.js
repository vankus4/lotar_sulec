const settings = require("../../config/settings");
const functions = require("../../functions/functions.js")

module.exports.run = function (reaction, user, bot) {
    return new Promise(function (resolve, reject) {
        if (!functions.reactionIsWhitelisted(reaction, bot)) { return reject() }
        let msg = reaction.message;
        let attachment = msg.attachments.first();
        if (!attachment) { return reject() }
        let nomination = {};

        user.send(`You nominated a post in **${msg.guild.name}**. Please, reply with a category name: (you have 2 minutes to answer)`, attachment).then(sentMsg => {
            return sentMsg.channel.awaitMessages(m => !m.author.bot, { max: 1, time: 2 * 60 * 1000, errors: ["time"] });
        }).then(collected => {
            nomination.category = collected.first().content;
            return user.send(`Short description: (you have 2 minutes to answer)`);
        }).then(sentMsg => {
            return sentMsg.channel.awaitMessages(m => !m.author.bot, { max: 1, time: 2 * 60 * 1000, errors: ["time"] });
        }).then(collected => {
            nomination.description = collected.first().content;
            return bot.client.users.fetch(settings.ownerId);
        }).then(owner => {
            return owner.send(`**ATTENTION!**\nUser ${user.username} wants to nominate a file.\ncategory: ${nomination.category}\ndescription: ${nomination.description}`, attachment);
        }).then(sentMsg => {
            nomination.messageId = sentMsg.id;
            nomination.authorId = user.id;
            nomination.dateCreated = new Date();
            sentMsg.react("💚").then(() => {
                sentMsg.react("💔");
            });
            return bot.db.collection("nominated").insertOne(nomination);
        }).then(res => {
            functions.log("db: one nomination inserted");
            return user.send(`Thank you! Your nomination is now awaiting verification.`);
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