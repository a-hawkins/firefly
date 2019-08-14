const { reportChannel } = require('../config.json');
const { types, prompts } = require('./report.json');

var getPrompt = function (label) {
    for (item of prompts) {
        if (item.label == label) {

            return item;
        }
    }

};
class ReportTemplate {
    constructor() {
        this._dataIndex = 0;
    };
    set type(name) {
        this._type = name;
    };
    get type() {
        return this._type;
    };
    set description(desc) {
        this._description = desc;
    };
    get description() {
        return this._description;
    };
    set data(dataArray) {
        this._data = dataArray;
    };
    get data() {
        return this._data;
    };
    get hasNextData() {
        if (this._data[this._dataIndex])
            return true;
        return false;
    };
    nextData() {
        if (this.hasNextData) {
            var currIndex = this._dataIndex;
            this._dataIndex = this._dataIndex + 1;
            return this._data[currIndex];
        }
    };

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


            const filter = m => m.author == message.author;
            const collector = message.author.dmChannel.createMessageCollector(filter);


            collector.on('collect', m => {
                console.log(`Collected ${m.content}`);
                const typeIndex = `${m.content}` - 1;
                if (types[typeIndex]) {
                    reportType = types[typeIndex].type;
                    message.author.dmChannel.send("Report type: " + reportType)

                    collector.stop("typeSelected");

                    var reportTemplate = new ReportTemplate();
                    reportTemplate.type = types[typeIndex].type;
                    reportTemplate.description = types[typeIndex].description;
                    reportTemplate.data = types[typeIndex].data;

                    console.log("type:");
                    console.log(reportTemplate.type);

                    const reportCollector = message.author.dmChannel.createMessageCollector(filter);

                    var nextData = reportTemplate.nextData();
                    console.log(nextData + ":");
                    var prompt = getPrompt(nextData);
                    message.author.send(prompt.prompt);

                    reportCollector.on('collect', m => {
                        console.log(`Collected ${m.content}`);
                       
                        if (`${m.content}` == 'end') {
                            reportCollector.stop("ended");
                        }
                        else if (`${m.content}` == 'cancel') {
                            message.author.send("Canceling report...")
                            console.log("Canceling report...");
                            reportCollector.stop("canceled");
                        }
                        else if (reportTemplate.hasNextData) {
                            nextData = reportTemplate.nextData();
                            console.log(nextData + ":");
                            var prompt = getPrompt(nextData);
                            message.author.send(prompt.prompt);
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
