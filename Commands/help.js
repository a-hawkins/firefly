module.exports = {
	name: 'help',
	description: 'List all commands or get more info on a specific command.',
	execute(message, args) {
		message.channel.send('Help is on the way!');
	},
};