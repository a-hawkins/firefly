const { reportChannel } = require('./config.json');
const { token } = require('./auth.json');
//const { client } = require('./bot.js');
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token);

function sendTicket(ticketData) {
    const channel = client.channels.find('name', 'reports');
    
    channel.send(JSON.stringify(ticketData, null, 2));
}

module.exports.sendTicket = sendTicket;