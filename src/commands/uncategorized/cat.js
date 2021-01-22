const settings = require("../../config/settings");
const fetch = require('node-fetch');

module.exports.run = function (bot, msg) {
    msg.channel.startTyping();
    fetch("http://aws.random.cat/meow").then(response => {
        response.json().then(body=>{
            msg.channel.send({
                files: [{
                    attachment: body.file,
                    name: `cat.${body.file.split('.')[4]}`
                }]
            });
        })
    }).catch(err => {
        console.log(err);
        msg.channel.send("unable to enter the cat dimension");
    }).then(() => {
        msg.channel.stopTyping();
    });
}

module.exports.help = {
    name: "cat",
    description: "sends a random cat picture",
    usage: `${settings.prefix}cat`
}