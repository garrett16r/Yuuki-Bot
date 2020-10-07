const { Command } = require('discord.js-commando');

module.exports = class TimerCommand extends Command {
  constructor (client) {
    super (client, {
      name: "timer",
      group: "util",
      memberName: "timer",
      description: "Creates a timer for a given number of seconds that will @ mention the user that created it when it finishes.",
      details: "",
      args: [
        {
          key: "seconds",
          prompt: "How many seconds will your timer be for?",
          type: "float"
        },
        {
          key: "message",
          prompt: "What message will be sent when the timer is up?",
          type: "string",
          default: ''
        }
      ],
      examples: [".yu timer <seconds>", ".yu timer <seconds> [message]"]
    })
  };

  async run(msg, { seconds, message }) {

    msg.reply(`timer for ${seconds} seconds started!`);

    setTimeout(async function() {

      const vc = msg.member.voice.channel;
      if (vc) {
        const connection = await vc.join();
        const dispatcher = connection.play("./res/alarm.mp3");

        dispatcher.on('finish', () => vc.leave());
      }

      if (!message) {
        msg.reply(`your ${seconds} second timer is up!`);
      } else {
        msg.reply(message);
      }

    }, seconds * 1000);
  }
}