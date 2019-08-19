const { types, prompts } = require('./report.json');
const { ReportTemplate } = require ('../reportTemplate.js');
const { sendTicket } = require ('../ticketSend.js');

const fs = require('fs');

var getPrompt = function (label) {
    for (item of prompts) {
        if (item.label == label) {

            return item;
        }
    }

};

module.exports = {
    name: 'report',
    description: 'Report something that needs reporting to the admins through a private pm! \nExamples include reporting a realm issue or a hacker. \nYou can initiate this command in a dm with this bot.',
    aliases: ['ticket', 'support'],
    cooldown: 10,


    execute(message, args) {

        if (message.channel.type != 'dm')
            message.reply("I'll send you a dm to get started on your report! If you don't get a dm from me, make sure you have dms enabled and try again.");
        const data = [];
        data.push("To cancel this report at any time, respond with \"cancel\".");
        data.push("What type of report are you making? Respond with a number.\n")
        for (var i = 0; i < types.length; i++) {
            data.push("**" + (i + 1) + "**.  " + types[i].type);
        };
        var reportType = "";
        console.log("Report started by: " + message.author.username);
        message.author.send("Let's get this report started.").then(() => {

            message.author.dmChannel.send(data);

            let ticket = {
                author: message.author.username
            }
            const filter = m => m.author == message.author;
            const collector = message.author.dmChannel.createMessageCollector(filter);


            collector.on('collect', m => {
                console.log(`Collected ${m.content}`);
                const typeIndex = `${m.content}` - 1;
                if (types[typeIndex]) {
                    reportType = types[typeIndex].type;
                    message.author.dmChannel.send("Report type: " + reportType)

                    ticket['type'] = reportType;

                    collector.stop("typeSelected");

                    var reportTemplate = new ReportTemplate();
                    reportTemplate.type = types[typeIndex].type;
                    reportTemplate.description = types[typeIndex].description;
                    reportTemplate.data = types[typeIndex].data;

                    console.log("type:");
                    console.log(reportTemplate.type);

                    const reportCollector = message.author.dmChannel.createMessageCollector(filter);
                    var response = [];
                    var nextData = reportTemplate.nextData();
                    console.log(nextData + ":");
                    var prompt = getPrompt(nextData);
                    message.author.send(prompt.prompt);

                    reportCollector.on('collect', m => {
                        console.log(`Collected ${m.content}`);
                        if (`${m.content}` == 'end') {
                            ticket[nextData] = response;
                            console.log("ended after: " + response);
                            reportCollector.stop("ended");
                        }
                        else if (`${m.content}` == 'cancel') {
                            message.author.send("Canceling report...")
                            console.log("Canceling report...");
                            reportCollector.stop("canceled");
                            //ticket[nextData] = response;
                        }
                        else {
                            response.push(`${m.content}`);
                            if (reportTemplate.hasNextData) {
                                ticket[nextData] = response;
                                let blank = [];
                                console.log('pushing: ' + response);
                                response = blank;
                                console.log('this should be empty: ' +response);
                                nextData = reportTemplate.nextData();
                                console.log(nextData + ":");
                                var prompt = getPrompt(nextData);
                                message.author.send(prompt.prompt);
                                
                            }
                        }

                    });
                    reportCollector.on('end', (collected, reason) => {
                        if (reason && reason == "canceled") {
                            console.log("Report canceled.");
                            message.author.send("Report canceled.");
                        }
                        else if (reason && reason == "ended") {
                            console.log("Report ended.");
                            message.author.send("Report ended.");
                            //TODO: handle report sendoff
                            ticket['status'] = 'new';
                            var ticketsJSON = [];
                            try {
                                let ticketsRaw = fs.readFileSync('tickets.json');
                                ticketsJSON = JSON.parse(ticketsRaw);

                            
                                ticket['id'] = ticketsJSON.tickets[ticketsJSON.tickets.length - 1].id + 1;
                                
                            } catch (error) {
                                ticketsJSON = [];
                                ticketsJSON['tickets'] = [];
                                ticket['id'] = 0;
                                
                            }
                            
                            //const ticketData = JSON.stringify(ticket, null, 2);
                            ticketsJSON.tickets.push(ticket);
                            sendTicket(ticket);
                            fs.writeFileSync('tickets.json', JSON.stringify(ticketsJSON, null, 2));
                        }
                        else {
                            console.log("Collector stopped, but no reason given.");
                        }

                    });

                }
                else if (`${m.content}` === "cancel") {
                    message.author.send("Canceling report...")
                    console.log("Canceling report...");
                    collector.stop("canceled");

                }
                else {
                    message.author.send("Invalid index. Try again.");
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason && reason == "canceled") {
                    console.log("Report canceled.");
                    message.author.send("Report canceled");
                }
                else if (reason && reason == "typeSelected") {
                    console.log("Type selected.");
                }
                else {
                    console.log("Collector stopped, but no reason given.");
                }

            });

        }).catch();

    }

}
