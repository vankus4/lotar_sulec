const settings = require("../../config/settings");
const functions = require("../../functions/functions.js")

module.exports.run = function (reaction, user, bot) {
    return new Promise(function (resolve, reject) {
        let msg = reaction.message;
        let nomination;
        if (!msg.author.bot || user.id !== settings.ownerId) { return resolve(`${user.username} reacted with a green heart to a post`) }
        bot.db.collection("nominated").findOne({ "messageId": msg.id }).then(res => {
            if (!res) { return Promise.reject("invalid nomination") }
            nomination = res;
            return bot.db.collection("nominated").deleteOne(res);
        }).then(obj => {
            return msg.delete();
        }).then(deletedMsg => {
            resolve(`nomination declined (category: ${nomination.category}, description: ${nomination.description})`);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports.properties = {
    name: "💔",
    description: "declines a nomination",
    usage: "react with 💔 to a post offered by your bot",
    blacklist: [],
    useWhitelist: false
}