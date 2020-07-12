const { Command } = require('discord.js-commando');
const { COMMANDS_ID } = require('../../constants.js');

module.exports = class TakeEmoteCommand extends Command {
    constructor (client) {
        super (client, {
          name: "takeemote",
          aliases: ["te", "take", "emote"],
          group: "util",
          memberName: "takeemote",
          description: "Takes an emote that is given as an argument and adds it to the current server.",
          details: "",
          args: [
            {
              key: "emote",
              prompt: "Which emote would you like to take?",
              type: "string"
            },
            {
              key: "name",
              prompt: "What would you like to name the emoji?",
              type: "string"
            }
          ],
          examples: [".yu takeemote/te/take/emote <:someEmote:> <emoteName>"]
        })
      };

      // https://cdn.discordapp.com/emojis/${emoji.id}./* extension of the emoji e.g: .png */

      async run(msg, { emote, name }) {
        const channel = this.client.channels.get(COMMANDS_ID);
        var fileExt = "";

        // Prevents entering anything other than an emote as the first argument
        if (emote.substring(0, 1) !== "<") {
          return channel.send("Not a valid emote!");
        }

        const emoteID = emote.split(":")[2].substring(0, 18); // Gets the ID of the emote, separating it from the rest of the tag

        // Determines if the URL should look for a .png or a .gif
        if (emote.split(":")[1] === "<a") {
            fileExt = "gif";
        } else {
            fileExt = "png";
        }

        const emoteURL = `https://cdn.discordapp.com/emojis/${emoteID}.${fileExt}`; // Builds the final URL
        console.log(emoteURL);

        msg.guild.createEmoji(emoteURL, name);

        channel.send("Emote added to the server!");
      }
}