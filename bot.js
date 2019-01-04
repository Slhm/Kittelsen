const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('winston');
const auth = require('./auth.json').token;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

client.on('ready', () => {
    logger.info('Connected!');
    logger.info('Logged in as: ' + client.user.tag + ' - (' + client.user.id + ')');
    client.user.setActivity("with a luigi board");
});

client.on('message', input => {
    var prefix = "!";
    inp = input.content;

    if (inp.startsWith(prefix)) {
        var args = inp.substr(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            case 'commands':
                input.channel.send('Available commands so far are: \n' +
                    'satan  -   sends sklask\n' +
                    'ping   -   pong!\n' +
                    'music  -   Tells about our one true queen\n' +
                    'cheers -   satanBot says cheers!, not much else for now. database that saves amount of cheers will come.\n' +
                    'future -   satanBot tells about the future'
                );
                break;
            case 'ping':
                input.channel.send('Pong!');
                break;
            case 'satan':
                console.log("heihei");
                input.channel.send("", {files: ["./resources/satanKawaii.gif"]});
                break;
            case 'music':
                input.channel.send('There is no music but our one true Queen, Jessica Kinney: https://www.youtube.com/watch?v=F9v8uCRucd0');
                break;
            case 'cheers':
                input.channel.send('Cheers, ' + input.author.username + '!');
                break;
            case 'future':
                input.channel.send('The future is vegan, my dude');
                break;
            // Just add any case commands if you want to..
        }
    }
});

client.login(auth);