const client = require("mongodb").MongoClient;

client.connect("mongodb://localhost:27017/").then(async mongoClient => {
    return mongoClient.db("discordBotDB").createCollection("audio");
}).then(res=>{
    console.log(res);
}).catch(err => {
    console.log(err);
});

// https://medium.com/@justintulk/flattening-nested-promises-in-javascript-88f04793ded7