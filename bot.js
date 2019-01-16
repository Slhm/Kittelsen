const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('winston');
const auth = require('./auth.json').token;
const imgflip = require('./auth.json').imgflip;
const fetch = require('node-fetch');
const fs = require('fs');
client.commands = new Discord.Collection();


//****TMP DATABASE******

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


//8Ball
let eightBall = ["Without a doubt.", "Yes.", "Fuck yes.", "Most likely.", "Pretty sure, yeah.", "I think so?", "Absolutely", "i don't know, dude. ask someone else",
  "My calculations says no.", "No.", "Don't count on it.", "This rng thing here says no.", "what? idk", "Probably not"];

// Logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';


// Client input handling

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
client.on('ready', async () => {
  logger.info('Connected!');
  logger.info('Logged in as: ' + client.user.tag + ' - (' + client.user.id + ')');
  client.user.setActivity("with a luigi board");
});

client.on('message', async input => {
  if (input.author.bot) return;
  if (input.channel.type === "dm") return;
  let prefix = "!";
  let inp = input.content;

  if (inp.startsWith(prefix)) {
    var args = inp.substr(prefix.length).split(' ');
    var cmd = args[0];

    /*
    //REGEX STUFF. MIGHT CHANGE TO IT EVENTUALLY
    //let arguments = inp.substring(prefix.length + cmd.length);

    arguments = arguments.split("'*'");
    for (let i = 0; i <= arguments.length; i++) {
      if (arguments[i] === "" || arguments[i] === " ") arguments.splice(i, 0);
    }
    arguments = arguments[0].split("'*'");

    //This is much prettier, but couldn't get it to work.
    //let regex = /("[a-zA-Z\s]+")/gm;
    //let arguments = regex.exec(inp.substr(prefix.length + cmd.length));
    */

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
    handleCommands(input, inp, cmd, arguments(inp), args);
  }
});


function handleCommands(input, inp, cmd, arguments, args) {
  switch (cmd) {
    case 'commands':
      input.channel.send('Available commands so far are: \n' +
        '!8         -      magic 8ball\n' +
        '!music     -      bot sends random good music.' + music.length + ' tracks in the collection atm. adding more eventually' + '\n' +
        '!cheers    -      bot says cheers!\n' +
        '!future    -      bot tells about the future\n' +
        '!ping      -      ping time\n' +
        '!fullwidth -      returns text in fullwidth\n' +
        '!poll      -      creates a poll\n' +
        '!satan\n' +
        '!todo      -      lists todo items'
      );
      break;
    case 'ping':
      let d = new Date();
      let ping = input.createdTimestamp - d.getTime();
      input.channel.send("Ping is: " + ping + "ms");
      break;
    case 'satan':
      input.channel.send("Satan wa totemo kawaīdesu ^w^", {files: ["./resources/satanKawaii.gif"]});
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
      client.commands.get('memes').run(client, input, args, arguments);
      break;
    case 'fullwidth':
      args === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(fullW(inp.split('!fullwidth')[1]));
      break;
    case 'futhark':
      args === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(eldF(inp.split('!futhark')[1]));
      break;
    case 'freedom':
      args === "" ? input.channel.send("you need a number and unit type after the command, my dude") : client.commands.get('freedom').run(client, input, args);
      break;
    case 'poll':
      client.commands.get('poll').run(client, input, args, arguments);
      break;
    case '8':
      let ans = eightBall[Math.floor(Math.random() * eightBall.length)];
      input.channel.send(ans);
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

function eldF(input) {
  let tmpString = "";
  let tmpValue;
  let tmpValue2;
  input = input.toLowerCase();


  const eldFArray = ["ᚨ", "ᛒ", "ᚲ", "ᛞ", "ᛖ", "ᚠ", "ᚷ", "ᚻ", "ᛁ", "ᛃ", "ᚲ", "ᛚ", "ᛗ", "ᚾ", "ᛟ", "ᛈ", "ᚲ", "ᚱ", "ᛊ", "ᛏ", "ᚢ", "ᚹ", "ᚹ", "ᚲᛊ", "ᛁ", "ᛉ", "ᚦ"];

  for (let i = 0; i < input.length; i++) {
    tmpValue = input.charCodeAt(i) - 97;


    if (i !== input.length) {
      tmpValue2 = input.charCodeAt(i + 1) - 97;
      if (tmpValue === 19 && tmpValue2 === 7) {
        tmpString += "ᚦ";
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


client.login(auth);