const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');
const tokenDaVoett = require('./auth.json').token;
const imgflip = require('./auth.json').imgflip;
const dbp = require('./auth.json').DB;
const ownerId = require('./auth.json').ownerId;
const fetch = require('node-fetch');
const fs = require('fs');
const mysql = require('mysql');
const dbHelper = require('./dbHelper.js');
const funcHelper = require('./funcHelper.js');
const config = require('./config');
client.commands = new Discord.Collection();

let con;
let banList = ['11'];

// reads and loads cmd files
fs.readdir("./cmds/", (err, files) => {
    if (err) console.error(err);

    let cmdsFiles = files.filter(f => f.split(".").pop() === "js");
    if (!cmdsFiles) {
        console.log("command files not found");
        return;
    }

    console.log("loading " + cmdsFiles.length + " files");
    cmdsFiles.forEach((f) => {
        let props = require('./cmds/' + f);
        console.log(f + " loaded!");
        client.commands.set(props.help.name, props);
    })
});

function handleDisconnect() {

    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: dbp.pass,
        database: dbp.database
    });

    con.connect(e => {
        if (e) {
            console.log("error connecting to db\n e: " + e);
            setTimeout(handleDisconnect, 2000);
        } else console.log("connected to drunkDB");
    });

    con.on('error', (e) => {
        console.log("db error", e);
        if (e.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw e;
        }
    })
}

handleDisconnect();


client.on('ready', () => {
    console.log('Connected!');
    console.log('Logged in as: ' + client.user.tag + ' - (' + client.user.id + ')');

    //fetches ban list from db
    updateBanList(banList);
    client.user.setActivity("dead");
});

client.on('message', async input => {
    let prefix = "!";

    //extracts text content of input object
    let inp = input.content;
    countVeg(input, inp);

    if (input.author.bot && !input.content.startsWith("!8")) return;
    if (input.channel.type === "dm") {
        funcHelper.logWarning(input);
        return;
    }
    if (input.guild.id === '458029332141572120') {
        if (!isMod(input) && !isCool(input) && !isKittelsen(input) && !isNew(input)) {
            funcHelper.logWarning(input);
        }
    }
    if (await isBanned(input, getBanList())) {
        funcHelper.logWarning(input);
        return;
    }


    if (inp.startsWith(prefix)) {
        funcHelper.logInfo(input);
        var args = inp.substr(prefix.length).split(' ');
        var cmd = args[0].toLowerCase();
        let text = inp.substr(cmd.length + 2);


        const arguments = (inp) => {
            let tmpString = "";
            let tmpArray = [];
            let tmpTypeOfQuote = "";
            let insideQuote = false;
            for (let i = 0; i < inp.length; i++) {
                if (inp.charAt(i) === "'" && !insideQuote) {
                    tmpTypeOfQuote = "'";
                    insideQuote = true;
                    continue;
                } else if (inp.charAt(i) === "\"" && !insideQuote) {
                    tmpTypeOfQuote = "\"";
                    insideQuote = true;
                    continue;
                } else if (inp.charAt(i) === "“" && !insideQuote) {
                    tmpTypeOfQuote = "“";
                    insideQuote = true;
                    continue;
                } else if (inp.charAt(i) === tmpTypeOfQuote && insideQuote) {
                    insideQuote = false;
                    tmpArray.push(tmpString);
                    tmpString = "";
                }
                if (insideQuote) tmpString += inp.charAt(i);
            }
            return tmpArray;
        };
        try {
            handleCommands(input, inp, cmd, arguments(inp), args, text);
        } catch (e) {
            funcHelper.logError(e);
            console.log(e);
        }
    }
});

client.on('error', (e) => {
    console.error("Error in client: " + e);
    funcHelper.logError('Client error: ' + e);
});

client.on('guildMemberAdd', member => {
    if (member.guild.id === '458029332141572120') {
        client.channels.get('458029595145404452').send("Hiiiiiiiiiiii " + "<@!" + member.id + ">" + ". Feel free to write something in " + client.channels.get('459007548247506965').toString() + ". Cheers")
    }
});


function handleCommands(input, inp, cmd, arguments, args, text) {
    switch (cmd) {
        case 'commands':
        case 'help':
            if (input.guild.id === '458029332141572120') {
                input.channel.send('Available commands are in: ' + input.guild.channels.get('534443945942581249').toString());
            } else input.channel.send(commandslol);
            break;
        case 'satan':
            input.channel.send("Satan wa totemo kawaīdesu ^w^", {files: ["./resources/satanKawaii.gif"]});
            break;
        case 'ud':
            client.commands.get('ud').run(client, input);
            break;
        case 'music':
            let msc = dbHelper.getRandomItem('music', con, input);
            input.channel.send(msc);
            break;
        case 'cheers':
            client.commands.get('cheers').run(client, input, args, con);
            break;
        case 'cozy':
        case 'cosy':
            client.commands.get('cozy').run(client, input, args, con, arguments);
            break;
        case 'ama':
            client.commands.get('ama').run(client, input, args, con, arguments);
            break;
        case 'future':
            input.channel.send('The future is vegan, my dude');
            break;
        case 'memes':
            client.commands.get('memes').run(client, input, args, arguments, con);
            break;
        case 'pp':
        case 'pfp':
            pp(input, args);
            break;
        case 'fullwidth':
        case 'aesthetic':
            typeof args[1] === 'undefined' ? input.channel.send("you need an argument after the command, my dude") :
                input.channel.send(fullW(text));
            break;
        case 'futhark':
        case 'runes':
            typeof args[1] === 'undefined' ? input.channel.send("you need an argument after the command, my dude") :
                input.channel.send(eldF(text));
            break;
        case 'freedom':
        case 'convert':
        case 'c':
            typeof args[1] === 'undefined' ? input.channel.send("you need a number and unit type after the command, my dude") :
                client.commands.get('freedom').run(client, input, args);
            break;
        case 'poll':
            typeof args[1] === 'undefined' ? input.channel.send("you need a title for the poll, my dude. check #info or ping comradeSeitan") :
                client.commands.get('poll').run(client, input, args, arguments);
            break;
        case '8':
            client.commands.get('8').run(client, input, args, con);
            break;
        case 'ping':
            let d = new Date();
            let ping = input.createdTimestamp - d.getTime();
            input.channel.send("Ping is: " + ping + "ms");
            break;
        case 'ø':
            input.channel.send({files: ["./resources/oe.jpg"]});
            break;
        case 'ban':
            let b = dbHelper.getRandomItem('banlist', con, input);
            input.channel.send(input.mentions.users.first() ? input.mentions.users.first().username + " " + b : funcHelper.makeArgument(args, 1) + " " + b);
            break;
        case 'shutdown':
            shutdown(input)
                .catch(e => {
                    console.log(e);
                    funcHelper.logError('shutdown error: ' + e);
                });
            break;
        case 'reboot':
            reboot(input)
                .catch(e => {
                    console.error(e);
                    funcHelper.logError('reboot error: ' + e);
                });
            break;
        case 'leave':
            if (isOwner(input) && arguments[0]) leave(input, arguments, args);
            else input.channel.send("no");
            break;
        case 'sa':
            if (isOwner(input) && args[1] === "-p") client.user.setActivity(arguments[0], {type: "PLAYING"});
            else if (isOwner(input) && args[1] === "-w") client.user.setActivity(arguments[0], {type: "WATCHING"});
            else if (isOwner(input) && args[1] === "-l") client.user.setActivity(arguments[0], {type: "LISTENING"});
            break;
        case 'botban':
            if (isOwner(input)) {
                if (input.mentions.users.first()) {
                    if (args[1] === "rm") {
                        dbHelper.deleteUserItem('botban', 'userId = ' + input.mentions.users.first().id, con, input)
                            .then(updateBanList);
                    } else if (arguments[0]) {
                        dbHelper.insertUserIdAndOneItem('botban', 'reason', input.mentions.users.first().id, arguments[0], con, input)
                            .then(updateBanList);
                    } else {
                        input.channel.send("wrong syntax my dude");
                    }
                } else {
                    if (args[1] === "rm" && arguments[0]) {
                        dbHelper.deleteUserItem('botban', 'userId = ' + arguments[0], con, input)
                            .then(updateBanList);
                    } else if (arguments[0]) {
                        dbHelper.insertUserIdAndOneItem('botban', 'reason', arguments[0], arguments[1], con, input)
                            .then(updateBanList);
                    } else {
                        input.channel.send("wrong syntax, my dude");
                    }
                }
            }
            break;
        case 'vcj':
            if ((args[1] === "on" && isOwner(input))) {
                imVeganFunc(true, input, args);
                input.react('✅');
            } else if (args[1] === "off") {
                imVeganFunc(false, input);
                input.react("❌");
            } else {
                input.react('👍');
            }
            break;
        case 'vertical':
            vertical(input, text);
            break;
        case 'mock':
        case 'mocking':
            mocking(input, text);
            break;
        case 'send':
            if (isOwner(input)) send(input, arguments[0], arguments[1]);
            break;
        case 'vegan-lb':
            getVegLeaderBoard(con, input);
            break;
        case 'bigemoji':
        case 'be':
            bigEmojiFunc(input, text);
            break;
    }
}


const bigEmojiFunc = async (input, text) => {
    var emoji = funcHelper.getEmojis(text);

    if (emoji) {
        await input.channel.send({
            files: [
                {
                    attachment: 'https://cdn.discordapp.com/emojis/' + emoji,
                    name: "bigEmoji.png"
                }
            ]
        });
    } else input.channel.send("couldnt find that emoji");
};

const getVegLeaderBoard = async (con, input) => {
    let d = new Date();
    let ut = Math.round(d.getTime() / 1000 * 10) / 10;

    await dbHelper.getOneItem('vegLB', 'time', '11', con, "time")
        .then(el => {

            //leaderboard has a 15 min cooldown.
            //TODO: make cooldown server specific.
            if (Math.round(el + 900) < ut) {
                dbHelper.updateItem('vegLB', ['time', 'id'], ut, 11, con);
                dbHelper.listHighScore('veg', 'im vegan', con, input);
            } else {
                input.channel.send("too early my dude. wait: " + (Math.round(((el + 900) - ut) / 60) + " minutes"));
            }
        });
};

//input: input object
//inp: text (input.content)
function countVeg(input, inp){
    if (!isKittelsen(input) && (inp.toLowerCase().includes("im vegan") ||
                                inp.toLowerCase().includes("i'm vegan") ||
                                inp.toLowerCase().includes("i'm vegan") ||
                                inp.toLocaleLowerCase().includes('i’m vegan'))) {
         dbHelper.incrementAmount('veg', input.author.id, con);
    }

}

//send message through bot.
function send(input, channelId, msg) {
    try {
        //console.log("\nchannelId: " + channelId + "\nmsg: " + msg);
        client.channels.get(channelId).send(msg);
    } catch (e) {
        funcHelper.logError('!send error: ' + e);
        input.channel.send("e: " + e);
    }
}

//checks if arguments are undefined
function isUndefined(input, args) {
    if (typeof args[1] === 'undefined') {
        input.channel.send("you need an argument after the command, my dude");
        return true;
    } else {
        return false;
    }

}

//checks for "cool-person" role
function isCool(input) {
    return input.member.roles.has('458031022563393536');
}

let isBanned = async (input, banList) => {
    await banList.forEach((el) => {
        if (el === input.author.id.toString()) return true;
    });
    return false;
};

//TODO: get vcj modID
function isvcjMod(input) {
    //if(input.member.roles.has(''));
}

//checks for mod role
function isMod(input) {
    return input.member.roles.has('458030682988609538');
}

//checks for "new-person" role
function isNew(input) {
    return input.member.roles.has('458334852874371093');
}

//checks if an id is the bot id
function isKittelsen(input) {
    return input.author.id === '418100748451315713';
}

//checks if id is of the bot owner
function isOwner(input) {
    return input.author.id === ownerId
}

//updates banlist
const updateBanList = async (banList) => {
    banList = await dbHelper.getAllUserIdsInTable('botban', con);
    setBanList(banList);
    return banList;
};

//get ban list
function getBanList() {
    return banList;
}

//set ban list
function setBanList(_banList) {
    banList = _banList;
}


//returns text lIkE tHiS
//input: input object
//text: string
function mocking(input, text) {
    let tmpString = "";
    text = text.toLowerCase();
    for (let i = 0; i < text.length; i++) {
        if (i % 2 === 1) {
            tmpString += text.charAt(i).toUpperCase();
        } else tmpString += text.charAt(i);
    }
    console.log("mocking: " + tmpString);
    input.channel.send(tmpString);
}

function imVeganFunc(on, input, args) {
    let ch = "";
    let isOn = on;

    if (isOn) {
        let r = Math.floor(Math.random() * 40 * 60 * 60 * 1000); // 40 hours
        let i = setTimeout(() => {
                client.channels.find("name", "talk-things").send("im vegan.");
                imVeganFunc(isOn, input);
                }, r
        );
    }
}

const shutdown = async (input) => {
    if (isOwner(input)) {
        console.log("Shutdown signal received.");
        input.channel.send("shutting down..")
            .then(() => con.end())
            .then(() => client.destroy());
    } else {
        input.channel.send("no");
    }
};

//makes bot leave server. server id for argument to make it leave an external server
const leave = async (input, arguments, args) => {
    if (isOwner(input)) {
        await funcHelper.logInfo(input);

        if (!arguments[0] && !args[0]) {
            input.channel.send("leaving. byyyyyyyyyyyye");
            input.guild.leave();
        } else {
            if (client.guilds.find(col => col.id === arguments[0].toString())) {
                client.guilds.find(col => col.id === arguments[0]).leave();
                input.channel.send("done.");
            } else input.channel.send("couldnt find server to leave");
        }
    } else input.channel.send("no");
};

//reboots bot
const reboot = async (input) => {
    if (isOwner(input)) {
        console.log("Reboot signal recieved.");
        input.channel.send("rebooting...")
            .then(() => client.destroy())
            .then(() => client.login(tokenDaVoett));
    } else {
        input.channel.send("no");
    }
};

//returns text in vertical/horizontal format.
const vertical = async (input, text) => {
    console.log("text: " + text);
    text = funcHelper.removeEmojis(text);
    let tmpString = text ? text : "";
    for (let i = 1; i < text.length; i++) {
        tmpString += "\n" + text.charAt(i);
    }
    input.channel.send(tmpString === "" ? "empty string" : tmpString);
};

//returns big avatar. if no arguments, returns avatar of command sender
const pp = async (input, args) => {
    let m = await input.channel.send("fetching avatar ...");

    //Check for @'ed user in input
    let user = input.mentions.users.first();
    //Check for userId in input.
    if (!user && args[1]) await client.fetchUser(args[1]).then((u) => {
        user = u;
    }).catch((e) => e.stack);

    //If user id in input
    if (args[1]) {
        await input.channel.send({
            files: [
                {
                    attachment: user.displayAvatarURL,
                    name: "avatar.png"
                }
            ]
        });
    }
    // If no arguments. Returns user avatar of user who did command.
    else {
        await input.channel.send({
            files: [
                {
                    attachment: input.author.displayAvatarURL,
                    name: "avatar.png"
                }
            ]
        });
    }
    m.delete();
};

//returns text in fullwidth
//input: string
function fullW(input) {
    let tmpString = "";

    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) >= 33 && input.charCodeAt(i) <= 270) {
            tmpString += String.fromCharCode(input.charCodeAt(i) + 65248)
        } else {
            tmpString += input.charAt(i);
        }
    }
    return tmpString;
}

//returns text in elder futhark
//input: string
function eldF(input) {
    let tmpString = "";
    let tmpValue;
    let tmpValue2;
    input = input.toLowerCase();


    let eldFArray = ["ᚨ", "ᛒ", "ᚲ", "ᛞ", "ᛖ", "ᚠ", "ᚷ", "ᚻ", "ᛁ", "ᛃ", "ᚲ", "ᛚ", "ᛗ", "ᚾ", "ᛟ", "ᛈ", "ᚲ", "ᚱ", "ᛊ", "ᛏ", "ᚢ", "ᚹ", "ᚹ", "ᚲᛊ", "ᛁ", "ᛉ", "ᚦ", "ᛜ"];

    for (let i = 0; i < input.length; i++) {
        tmpValue = input.charCodeAt(i) - 97;

        if (i !== input.length) {
            tmpValue2 = input.charCodeAt(i + 1) - 97;
            if (tmpValue === 19 && tmpValue2 === 7) {
                tmpString += eldFArray[26];
                i++;
                continue;
            } else if (tmpValue === 13 && tmpValue2 === 6) {
                tmpString += eldFArray[27];
                i++;
                continue;
            }
        }

        if (tmpValue >= 0 && tmpValue <= 25) {
            tmpString += eldFArray[tmpValue];
        } else {
            tmpString += input.charAt(i);
        }
    }
    return tmpString;
}

let commandslol = "**MOST USEFUL COMMANDS: **\n" +
    "**!8**  -  Magic 8ball (if question contains an \"or\", it chooses one of the two)\n" +
    "**!ud** - urban dictionary (add -i 1 at the end for the second highest rated entry, -i 2 for third and so on)\n" +
    "**!freedom**  -  Converts imperial to metric, vice versa, and currencies(usd,nok,cad,nzd,eur).\n" +
    "    !freedom 10lbs\n" +
    "**!memes**  -  Generates memes. (see bottom of this post)\n" +
    "**!cheers**  -  simple point system. toast with people by \\@ing them. \n" +
    "**!pp**  -  !pp @USER (or user id) for big profile pic\n" +
    "**!be**  -  !be (emoji) for big emoji" +
    "**!ban**  -  @ someone to ban them. (not really) \n" +
    "**!poll**  -  Makes a poll\n" +
    "    !poll 'SUBJECT HERE'  (add emojis at the end for custom reactions. thumbs up/down is default.)\n" +
    "**!cozy**  -  returns something cozy. add stuff with \" !cozy add 'LINK HERE' \"\n" +
    "\n" +
    "**TEXT MANIPULATION **\n" +
    "**!vertical**  -  outputs text in vertical /horizontal\n" +
    "**!aesthetic**  -  outputs text in ｆｕｌｌｗｉｄｔｈ\n" +
    "**!runes**  -  outputs text in ᛖᛚᛞᛖᚱ ᚠᚢᚦᚨᚱᚲ\n" +
    "**!mock**  -  oUtPuTs TeXt LiKe ThIs\n" +
    "\n" +
    "**MISC**\n" +
    "**!future**  -  Returns something about the future\n" +
    "**!satan**  -  UwU\n" +
    "\n" +
    "**!memes** - check <https://imgur.com/a/ZwLtHJd> for available templates and command example.\n" +
    "Syntax example: ```!memes exit 'text1' 'text2' 'text3' ```\n" +
    "^ would produce this image -> <https://imgflip.com/i/2rd1ep>";



client.login(tokenDaVoett);


