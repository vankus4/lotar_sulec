const fetch = require('node-fetch');

module.exports.run = function (msg, bot, options) {
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

module.exports.properties = {
    name: "cat",
    description: "sends a random cat picture",
    usage: "cat",
    blacklist: [],
    useWhitelist: false
}