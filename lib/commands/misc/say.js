const { Command } = require('discord.js-commando');
const { Channel } = require('discord.js');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            group: "misc",
            memberName: "say",
            description: "tells the bot to say something in chat",
            details:"",
            args: [
                {
                    key: "input",
                    prompt: "",
                    type: "string",
                }
            ],
            examples: [".yu say [message]", ".yu say Nat is a very nice piece of female."]
        });
    }

    async run(msg, { input }) {
        msg.delete(); // Gets rid of the message containing the command
        msg.channel.send(input); // Sends the provided messsage
    }
}