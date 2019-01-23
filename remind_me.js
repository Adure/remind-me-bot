const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
moment.locale('en-au');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('error', error => { console.log(error); });

client.on('message', message => {
    if (message.content.startsWith('/remindme')) {
        let content = message.content.replace("/remindme", "").trim();
        let method = content.split(" ", 1)[0];

        if (method != 'in' && method != 'at') {
            message.channel.send(`"${method}" is not an accepted method`);
            return;
        }

        let parts = content.split(",");
        try {
			var author = message.member;
            var time = parts[0].replace(/^in|at$/, "").trim();
            var type = time.replace(/[0-9]/g, '').trim();
            time = time.replace(/\D+\:/g, '').trim();
            var msg = parts[1].trim();
        } catch(error) {
            console.error(error);
        }

        if (method === 'at') {
            var dateTime = moment(time, ["h-mA", "H-m", "h-mA D-M-YY", "H-m D-M-YY"]).toDate();
        } else {
            var now = new Date();
            var dateTime;
            var timeUntil;
            time = time.replace(/\D+/g, '').trim()

            switch (type) {
                case 'sec':
                case 'secs':
                case 'second':
                case 'seconds': {
                    timeUntil = now.setSeconds(now.getSeconds()+Number(time));
                    dateTime = new Date(timeUntil);
                    break;
                }
                case 'min':
                case 'mins':
                case 'minute':
                case 'minutes': {
                    timeUntil = now.setMinutes(now.getMinutes()+Number(time));
                    dateTime = new Date(timeUntil);
                    break;
                }
                case 'hour':
                case 'hours': {
                    timeUntil = now.setHours(now.getHours()+Number(time));
                    dateTime = new Date(timeUntil);
                    break;
                }
                default:
                    message.channel.send(`"${type}" is not an accpted time format`);
                    return;
            }
        }
        
        createJob(dateTime, msg, author);
        message.channel.send("I'll remind you then!");
    }
});

function findSecondsDifference(date1, date2) {
    var oneSecond_ms = 1000;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms/oneSecond_ms);
}

function createJob(time, msg, author) {
    let secondsUntil = findSecondsDifference(new Date(), time);

    let task = setTimeout(sendReminder, secondsUntil*1000, msg, author);
    console.log(`${author.tag} created task, ${msg}, to run in ${secondsUntil} seconds`);
}

function sendReminder(msg, user) {
    user.send(`**I was told to remind you to:** ${msg}`)
        .then(console.log(`Sent reminder, ${msg}, to ${user.tag}`))
        .catch(console.error);
}

client.login('e');