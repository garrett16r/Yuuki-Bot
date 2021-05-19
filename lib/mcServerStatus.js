const util = require('minecraft-server-util');

let mcStatusMain = async (client) => {
    setInterval(async function() {
        util.status('syntthetix.meloncu.be')
        .then(async (response) => {
            console.log(`Players Online: ${response.onlinePlayers}`);
            await client.guilds.cache.get("591212574826168330").channels.cache.get("844428920430133258").setName(`Players Online: ${response.onlinePlayers}`);
        })
        .catch((error) => {
            console.error(error);
        });
    }, 30000);
}

module.exports = { mcStatusMain };