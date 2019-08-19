const { sendTicket } = require ('../ticketSend.js');
module.exports = {
	name: 'test-command',
	description: 'this is just a dummy command to test different things. Results may vary',
	execute(message) {

		sendTicket("(pretend this is a ticket)");
	},
};