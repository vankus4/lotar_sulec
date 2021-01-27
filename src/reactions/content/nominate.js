const settings = require("../../config/settings");

module.exports.run = function (reaction, user, bot) {
    return new Promise(function (resolve, reject) {
        let msg = reaction.message;
        let nominationMsg = `**${user.username}** from **${msg.guild.name}** wants you to accept this submission:`;
        bot.client.users.fetch(settings.ownerId).then(user => {
            return user.send(nominationMsg, msg.attachments.first());
        }).then(sentMsg=>{
            resolve()
        }).catch(err => {
            reject(err);
        })

    });
}

module.exports.properties = {
    name: "⭐",
    description: "nominates an attachment to be permanently included in this bot",
    usage: "react with :star: to a message with an attachment",
    blacklist: [],
    useWhitelist: false
}