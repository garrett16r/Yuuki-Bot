const LeagueJS = require('leaguejs/lib/LeagueJS.js');
const Discord = require('discord.js');
const { getRNG, getChannel } = require('./util.js');

const ljs = new LeagueJS(process.env.LEAGUE_API_KEY);

let getElement = (elem) => {
    return new Promise((resolve, reject) => {
        let elements = ['Water', 'Earth', 'Fire', 'Air'];

        if (elem == 'none') {
            resolve(elements[getRNG(4)]);
        }
        
        let newElem;
        let loop = true;
        while (loop) {
            newElem = elements[getRNG(4)];

            if (newElem !== elem) {
                loop = false;
                resolve(newElem);
            }
        }
    });
}

let getSummId = () => {
    return new Promise((resolve, reject) => {

        ljs.Summoner.gettingByName('7L0VE')
        .then(data => {
            resolve(data.id);
        }).catch(err => {
            reject(err);
        });
    });
}

let elementMain = async (client) => {

    var interval = 60000; // 1 minute

    setInterval(async function() {

        if (interval == 2100000) {
            interval = 60000;
        }

        let summID = await getSummId();

        ljs.Spectator.gettingActiveGame(summID)
        .then(data => {
            
            data.participants.forEach(async element => {
                if (element.summonerId == '7L0VE' && element.championId == '_44JeBh_kKMa6MTZteCFAOOHKoVHpBKsXgiVhts83EZzlPwR') {
                    let elem1 = await getElement('none');
                    let elem2 = await getElement(elem1);
    
                    console.log(elem1);
                    console.log(elem2);
    
                    const chanID = await getChannel('general');
                    const channel = client.channels.cache.get(chanID);
    
                    channel.send(`Noah is using **${elem1}** and **${elem2}** on Elementalist Lux this game!`);

                    interval = 2100000; // Set interval to 35 minutes to account for full game
                } 
            });
        }).catch(err => {}); 
    }, interval);
}

module.exports = { elementMain };