const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');
const tokenDaVoett = require('./auth.json').token;
const imgflip = require('./auth.json').imgflip;
const dbp = require('./auth.json').drunkDB;
const ownerId = require('./auth.json').ownerId;
const fetch = require('node-fetch');
const fs = require('fs');
const mysql = require('mysql');
const dbHelper = require('./dbHelper.js');
const funcHelper = require('./funcHelper.js');
const config = require('./config');
client.commands = new Discord.Collection();

let imVegan = false;
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
    password: dbp,
    database: "drunkdb"
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
  updateBanList(banList);
  client.user.setActivity("dead");
});

client.on('message', async input => {

  if (input.author.bot && !input.content.startsWith("!8")) return;
  if (input.channel.type === "dm") {
    funcHelper.logWarning(input);
    return;
  }
  if (input.guild.id === '458029332141572120') {
    if (!isMod(input) && !isCool(input) && !isKittelsen(input)) {
      funcHelper.logWarning(input);
      return;
    }
  }
  if (await isBanned(input, getBanList())) {
    funcHelper.logWarning(input);
    return;
  }
  //console.log("username: " + input.author.username + ", roleId: " + input.member.roles.last());
  let prefix = "!";
  let inp = input.content;





  if (inp.startsWith(prefix)) {
    funcHelper.logInfo(input);
    var args = inp.substr(prefix.length).split(' ');
    var cmd = args[0].toLowerCase();
    let text = inp.substr(cmd.length + 2);


    const arguments = (inp) => {
      let tmpString = "";
      let tmpArray = [];
      let insideQuote = false;
      for (let i = 0; i < inp.length; i++) {
        if (inp.charAt(i) === "'" && !insideQuote) {
          insideQuote = true;
          continue;
        } else if (inp.charAt(i) === "'" && insideQuote) {
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
  } else if (imVegan && (inp.startsWith("im") || inp.startsWith("i'm"))) {
    input.channel.send("im vegan");
  } else if (inp.toLowerCase().includes("im vegan") || inp.toLowerCase().includes("i'm vegan")) await dbHelper.incrementAmount('veg', input.author.id, con);
});

client.on('error', (e) => {
  console.error("Error in client: " + e);
  funcHelper.logError('Client error: ' + e);
});


function handleCommands(input, inp, cmd, arguments, args, text) {
  switch (cmd) {
    case 'commands':
    case 'help':
      if (input.guild.id === '458029332141572120') {
        input.channel.send('Available commands are in: ' + input.guild.channels.get('534443945942581249').toString());
      }
      break;
    case 'satan':
      input.channel.send("Satan wa totemo kawaīdesu ^w^", {files: ["./resources/satanKawaii.gif"]});
      break;
    case 'ud':
      client.commands.get('ud').run(client, input);
      break;
    case 'music':
      let msc = music[Math.floor(Math.random() * music.length)];
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
      typeof args[1] === 'undefined' ? input.channel.send("you need a title for the poll, my dude. check #info") :
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
    case 'ban' :
      let b = banArray[Math.floor(Math.random() * banArray.length)];
      input.channel.send(input.mentions.users.first() + b);
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
    case 'sa':
      if (isOwner(input) && args[1] === "-p") client.user.setActivity(arguments[0], {type: "PLAYING"});
      else if (isOwner(input) && args[1] === "-w") client.user.setActivity(arguments[0], {type: "WATCHING"});
      else if (isOwner(input) && args[1] === "-l") client.user.setActivity(arguments[0], {type: "LISTENING"});
      break;
    case 'botban':
      if (isOwner(input)) {
        if (input.mentions.users.first()) {
          if (args[1] === "rm") {
            dbHelper.deleteItem('botban', 'userId = ' + input.mentions.users.first().id, con, input)
              .then(updateBanList);
          } else {
            dbHelper.insertUserIdAndOneItem('botban', 'reason', input.mentions.users.first().id, arguments[0], con, input)
              .then(updateBanList);
          }
        } else {
          if (args[1] === "rm") {
            dbHelper.deleteItem('botban', 'userId = ' + arguments[0], con, input)
              .then(updateBanList);
          } else {
            dbHelper.insertUserIdAndOneItem('botban', 'reason', arguments[0], arguments[1], con, input)
              .then(updateBanList);
          }
        }
      }
      break;
    case 'imvegan':
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
    case 'vcj':
      if (imVegan) input.react('❌');
      else input.react('✅');
      imVegan = !imVegan;
      break;
    case 'vertical':
      vertical(input, text);
      break;
    case 'mock':
    case 'mocking':
      mocking(input, text);
      break;
    case 'send':
      if(isOwner(input)) send(input, arguments[0],arguments[1]);
      break;
    case 'imv-l':
      dbHelper.listHighScore('veg', 'im vegan', con, input);
  }
}

function send(input, channelId, msg){
  try{
    //"guildId: " + guildId +
    console.log( "\nchannelId: " + channelId + "\nmsg: " + msg);
    client.channels.get(channelId).send(msg);
  }catch(e){
    funcHelper.logError('!send error: ' + e);
    input.channel.send("e: " + e );
  }
}

function isUndefined(input, args){
  if(typeof args[1] === 'undefined') {
    input.channel.send("you need an argument after the command, my dude");
    return true;
  }else{
    return false;
  }

}


function isCool(input) {
  return input.member.roles.has('458031022563393536');
}

let isBanned = async (input, banList) => {
  let banned = false;
  await banList.forEach((el) => {
    if (el === input.author.id.toString()) banned = true;
  });
  return banned;
};

function isMod(input) {
  return input.member.roles.has('458030682988609538');
}

function isKittelsen(input) {
  return input.author.id === '418100748451315713';
}

function isOwner(input) {
  return input.author.id === ownerId
}

const updateBanList = async (banList) => {
  banList = await dbHelper.getAllUserIdsInTable('botban', con);
  setBanList(banList);
  return banList;
};

function getBanList() {
  return banList;
}

function setBanList(_banList) {
  banList = _banList;
}

function mocking(input,text){
    let tmpString = "";
    text = text.toLowerCase();
    for(let i=0;i<text.length;i++){
	if(i % 2 === 1){
	    tmpString += text.charAt(i).toUpperCase();
	}else tmpString += text.charAt(i);
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

const vertical = async (input, text) => {
  console.log("text: " + text);
  text = removeEmojis(text);
  let tmpString = text ? text : "";
  for (let i = 1; i < text.length; i++) {
    tmpString += "\n" + text.charAt(i);
  }
  input.channel.send(tmpString === "" ? "empty string" : tmpString);
};

function removeEmojis(input){
  return input.replace(/<(.*?)>/gm, '');
}

const pp = async (input, args) => {

  let m = await input.channel.send("fetching avatar ...");
  let user = input.mentions.users.first();
  if (!user) await client.fetchUser(args[1]).then((u) => {
    user = u;
    console.log("user: " + user + ", user.avatarshit: " + user.displayAvatarURL)
  }).catch((e) => e.stack);

  if (args[1]) {
    await input.channel.send({
      files: [
        {
          attachment: user.displayAvatarURL,
          name: "avatar.png"
        }
      ]
    });
  } else {
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

//eldF encrypt
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


client.login(tokenDaVoett);


/*
'Available commands so far are: \n' +
        '!8         -      magic 8ball\n' +
        '!music     -      bot sends random good music.' + music.length + ' tracks in the collection atm. adding more eventually' + '\n' +
        '!cheers    -      bot says cheers!\n' +
        '!future    -      bot tells about the future\n' +
        '!ping      -      ping time\n' +
        '!fullwidth -      returns text in fullwidth\n' +
        '!poll      -      creates a poll\n' +
        '!satan\n' +
        '!todo      -      lists todo items'
 */

//Music
let music = [
  "There is no music but our one true Queen, Jessica Kinney: https://www.youtube.com/watch?v=F9v8uCRucd0",
  "Float away in the endless ocean of icelandic fart smelling water: https://www.youtube.com/watch?v=Gf1h2PMPCAo",
  "Drunk jazzy tunes are the best kind of tunes: https://www.youtube.com/watch?v=0BRxDp2u02U",
  "Japanesey mathy rocky https://www.youtube.com/watch?v=Tc1yD9H7Rb8",
  "Shameless self plug. https://floatingnomore.bandcamp.com/",
  "ｍｅｌａｎｃｈｏｌｙ ｉｓ ｅｔｅｒｎａｌ: https://www.youtube.com/watch?v=co5gy_2uOEY",
  "ᛞᚢ ᚲᚨᚾ ᛁᚲᚲᛖ ᛚᛖᛊᛖ ᛞᛖᛏᛏᛖ ᚢᚨᚾᛊᛖᛏᛏ, ᛗᛖᚾ ᛖᚾᛊᛚᚨᚹᛖᛞ ᛖᚱ ᚲᚢᛚᛏ: https://youtu.be/Rcssy33l04Y?t=31",
  "brutus for fucking ever https://www.youtube.com/watch?v=1Z-0j4mRbB0",
  "all hail the mighty emperor https://www.youtube.com/watch?v=4FYwz2-_G_4"
];

let banArray = ["HAS BEEN BANNED FOR LIFE",
  "HAS BEEN DEMOLISHED INTO THE PAVEMENT, AND ALSO BANNED", "hAs BeEn BaNnEd LolLll",
  "was eradicated out of our bleak fucking existance", "got fucking banned, yay",
  "said AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆHHHHHHHHHHHHHHHHH as they \"fell\" off a cliff",
  "was forced out the moon door, wooooooooo", " was revealed as an omniscum, and is no longer welcome here.", "is no longer with us :("];
