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
    const content = msg.content.substr(2).toLowerCase().split(' ');
    const command = content[0]
    if (command === 'ping') {
        msg.channel.send('pong')
        return('ping');
    }
    if (command === 'help')
    {
        help(msg);
        return('help');
    }
}
function help(msg)
{
    msg.channel.send('Help is on the way!');
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