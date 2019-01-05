const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('winston');
const auth = require('./auth.json').token;
const imgflip = require('./auth.json').imgflip;
const fetch = require('node-fetch');
//tmp "database"
let music = Array(0);
music.push(
    "There is no music but our one true Queen, Jessica Kinney: https://www.youtube.com/watch?v=F9v8uCRucd0",
    "Float away in the endless ocean of icelandic fart smelling water: https://www.youtube.com/watch?v=Gf1h2PMPCAo",
    "Drunk jazzy tunes are the best kind of tunes: https://www.youtube.com/watch?v=0BRxDp2u02U",
    "Japanesey mathy rocky https://www.youtube.com/watch?v=Tc1yD9H7Rb8",
    "Shameless self plug. https://floatingnomore.bandcamp.com/",
    "ｍｅｌａｎｃｈｏｌｙ ｉｓ ｅｔｅｒｎａｌ: https://www.youtube.com/watch?v=co5gy_2uOEY",
    "ᛞᚢ ᚲᚨᚾ ᛁᚲᚲᛖ ᛚᛖᛊᛖ ᛞᛖᛏᛏᛖ ᚢᚨᚾᛊᛖᛏᛏ, ᛗᛖᚾ ᛖᚾᛊᛚᚨᚹᛖᛞ ᛖᚱ ᚲᚢᛚᛏ: https://youtu.be/Rcssy33l04Y?t=31"
);
let memeArray = ["boromir", "aliens", "spongebob"];
let memeArrayID = [61579, 101470, 102156234];
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
    if (input.author.bot) return;
    let prefix = "!";
    inp = input.content;

    if (inp.startsWith(prefix)) {
        var args = inp.substr(1).split(' ');
        var cmd = args[0];

        //let arguments = inp.substring(prefix.length + cmd.length);
        /*
        arguments = arguments.split("'*'");
        for (let i = 0; i <= arguments.length; i++) {
            if (arguments[i] === "" || arguments[i] === " ") arguments.splice(i, 0);
        }
        arguments = arguments[0].split("'*'");
        */
        //This is much prettier, but couldn't get it to work.
        //let regex = /("[a-zA-Z\s]+")/gm;
        //let arguments = regex.exec(inp.substr(prefix.length + cmd.length));

        const arguments = (inp) => {
            let tmpString = "";
            let tmpArray = [];
            let insideQuote = false;
            for (let i = 0; i < inp.length; i++) {
                if (inp.charAt(i) === "'" && !insideQuote) {
                    insideQuote = true;
                    continue;
                }
                else if (inp.charAt(i) === "'" && insideQuote) {
                    insideQuote = false;
                    tmpArray.push(tmpString);
                    tmpString = "";
                }
                if (insideQuote) tmpString += inp.charAt(i);
            }
            return tmpArray;
        };
        handleCommands(input, inp, cmd, arguments(inp));
    }
});
/*
var promise = new Promise(function(resolve, reject){
    resolve(1);
});
*/
function handleCommands(input, inp, cmd, arguments) {
    switch (cmd) {
        case 'commands':
            input.channel.send('Available commands so far are: \n' +
                '!satan     -      sends sklask\n' +
                '!music     -      satanBot sends random good music.' + music.length + ' tracks in the collection atm. adding more eventually' + '\n' +
                '!cheers    -      satanBot says cheers!\n' +
                '!future    -      satanBot tells about the future\n' +
                '!ping      -      ping time\n' +
                '!fullwidth -      returns text in fullwidth\n' +
                '!poll      -      creates a poll\n' +
                '!todo      -      lists todo items'
            );
            break;
        case 'ping':
            let ping = new Date().getTime() - input.createdTimestamp;
            input.channel.send("Ping is: " + ping + "ms");
            break;
        case 'satan':
            input.channel.send("satan-chaaaaan ^w^", {files: ["./resources/satanKawaii.gif"]});
            break;
        case 'music':
            let msc = music[Math.floor(Math.random() * music.length)];
            input.channel.send(msc);
            break;
        case 'cheers':
            input.channel.send('Cheers, ' + input.author.username + '!');
            //input.channel.send('array: ' + arguments);
            break;
        case 'future':
            input.channel.send('The future is vegan, my dude');
            break;
        case 'memes':
            input.channel.send("fetching meme, just a sec");
            fetchMeme(input, memeArrayID[0], arguments[0], arguments[1]);
            /*
            for(let i = 0; i <= memeArray.length; i++){
                if (memeArray[i] === args[1]) {

                    input.channel.send("fetching meme, just a sec");
                    //fetchMeme(input, "101470", "svarte faens: ", "svupp");
                    fetchMeme(input, memeArrayID[i], arguments[0], arguments[1]);
                    break;
                }
            }
            input.channel.send("Couldnt find that. Try one of these: \n" +
                                memeArray + "\n" +
                                "or ping noekk to add more options");
            */
            break;

        //input.channel.send("fetching meme, just a sec");
        //fetchMeme(input, "101470", "svarte faens: ", "svupp");
        //fetchMeme(input, "101470", arguments[0], arguments[1]);
        //break;
        case 'fullwidth':
            let fullArg = inp.split('!fullwidth')[1];
            fullArg === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(fullW(fullArg));
            break;
        case 'poll':
            console.log(arguments[0]);
            input.channel.send("Creating a poll on \n" + arguments[0]);

            //message.author.id.react('👍');
            //input.channel.reactions(':thumbsup:');
            break;
        case 'todo':
            input.channel.send('TODO items are\n' +
                'Commands: \n' +
                'cozy - send random cozy picture/music/something\n' +
                'memes - send random quality meme. need a good api first\n' +
                'Implementations: \n' +
                'Add database to save amount of cheers users have given eachother, and to save music entries\n');
    }
}


//var memePromise = new Promise(function(fetchMeme(), failFetchMeme(input))
/*
const failFetchMeme = (input) => {
    input.channel.send("fetching of meme failed");
};
*/
const fetchMeme = (input, type, _text0, _text1) => {

    return fetch('https://api.imgflip.com/caption_image?' +
        'username=' + imgflip.user +
        '&password=' + imgflip.pass +
        '&template_id=' + type +
        '&text0=' + _text0 +
        '&text1=' + _text1)
        .then(response => response.json())
        .then(res => {
            let suc = JSON.stringify(res.success);
            let url = res.data.url;
            if (suc === 'true') input.channel.send(url);
            else input.channel.send("something went wrong :( \n" + "ping noekk#8059 to let him know he fucked up");
        }).catch(error => console.error(error))
};

function fullW(input) {
    var tmpString = "";

    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) >= 33 && input.charCodeAt(i) <= 270) {
            tmpString += String.fromCharCode(input.charCodeAt(i) + 65248)
        } else {
            tmpString += input.charAt(i);
        }
    }
    return tmpString;
}

client.login(auth);


/*
const fetchMeme = (input, type, _text0, _text1) => {

    //console.log(imgflip.user, " ", imgflip.pass);

    return fetch('https://api.imgflip.com/caption_image?' +
        'username=' + imgflip.user +
        '&password=' + imgflip.pass +
        '&template_id=' + type +
        '&text0=' + _text0 +
        '&text1=' + _text1 +
        '.json'
    ).then(function (response) {
        console.log(response);
        return response.json;
    }).catch(function(){
        console.log(error);
    }).then(function (res) {
        let suc = JSON.stringify(res.success);
        let url = JSON.stringify(res.data.url);
        //console.log(res);
        if (suc === true) input.channel.send(url);
        else input.channel.send("something went wrong :/\n" + suc + url);
    }).catch(function(error){
        console.log(error.message);
    });

};
 */