

module.exports.run = function (msg, bot, options) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}

module.exports.properties = {
    name: "yt",
    description: "queues a video from youtube and plays the audio",
    usage: "yt <keywords or URL>",
    blacklist: [],
    useWhitelist: false
}