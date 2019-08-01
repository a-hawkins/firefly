const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = "f!";

function isToBot(msg) {
    return (msg.content.startsWith(prefix));
};


function processMsg(msg)
{
    if (msg.content.length<3)
        return;
    const content = msg.content.substr(2).toLowerCase();

    if (content === 'ping') {
        msg.reply('pong');
    }
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
    if (isToBot(msg)) {
      processMsg(msg);
    }
});

client.login(auth.token);