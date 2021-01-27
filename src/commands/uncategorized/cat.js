const fetch = require('node-fetch');

module.exports.run = function (msg, bot, options) {
    return new Promise(function (resolve, reject) {
        msg.channel.startTyping();
        fetch("http://aws.random.cat/meow").then(response => {
            return response.json()
        }).then(body => {
            return msg.channel.send({
                files: [{
                    attachment: body.file,
                    name: `cat.${body.file.split('.')[4]}`
                }]
            });
        }).then(sentMsg=>{
            resolve();
        }).catch(err => {
            console.log(err);
            reject("unable to enter the cat dimension");
        }).then(() => {
            msg.channel.stopTyping();
        });
    });
}

module.exports.properties = {
    name: "cat",
    description: "sends a random cat picture",
    usage: "cat",
    blacklist: [],
    useWhitelist: false
}