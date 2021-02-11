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
            resolve(`nomination accepted (category: ${nomination.category}, description: ${nomination.description})`);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports.properties = {
    name: "💚",
    description: "approves a nomination to be stored in the bot's database",
    usage: "react with 💚 to a post offered by your bot",
    blacklist: [],
    useWhitelist: false
}