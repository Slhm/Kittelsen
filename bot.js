const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('winston');
const auth = require('./auth.json').token;
const imgflip = require('./auth.json').imgflip;
const dbp = require('./auth.json').drunkDB;
const ownerId = require('./auth.json').ownerId;
const fetch = require('node-fetch');
const fs = require('fs');
const mysql = require('mysql');
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

let imVegan = false;


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

let con;

function handleDisconnect() {


  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: dbp,
    database: "drunkdb"
  });

  con.connect(e => {
    if (e) {
      console.log("error connecting to db");
      setTimeout(handleDisconnect, 2000);
    }
    console.log("connected to drunkDB - eight");
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

client.on('ready', async () => {
  logger.info('Connected!');
  logger.info('Logged in as: ' + client.user.tag + ' - (' + client.user.id + ')');
  client.user.setActivity("with a luigi board");
});

client.on('message', async input => {
  if (input.author.bot && !input.content.startsWith("!8")) return;
  if (input.channel.type === "dm") return;
  if (input.guild.id === '458029332141572120') {
    //console.log("isMod: " + isMod(input) + ", isCool: " + isCool(input));
    if (!isMod(input) && !isCool(input) && !isKittelsen(input)) return;
  }
  //console.log("username: " + input.author.username + ", roleId: " + input.member.roles.last());
  let prefix = "!";
  let inp = input.content;

  if (inp.startsWith(prefix)) {
    var args = inp.substr(prefix.length).split(' ');
    var cmd = args[0];


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
    try {
      handleCommands(input, inp, cmd, arguments(inp), args);
    } catch (e) {
      console.log(e);
    }
  } else if (imVegan && (inp.startsWith("im") || inp.startsWith("i'm"))) {
    input.channel.send("im vegan");
  }
});

client.on('error', (e) => {
  console.error("Error in client: " + e);
});


function handleCommands(input, inp, cmd, arguments, args) {
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
    case 'future':
      input.channel.send('The future is vegan, my dude');
      break;
    case 'memes':
      client.commands.get('memes').run(client, input, args, arguments);
      break;
    case 'pp':
    case 'pfp':
      pp(input, args);
      break;
    case 'fullwidth':
      args === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(fullW(inp.split('!fullwidth')[1]));
      break;
    case 'aesthetic':
      args === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(fullW(inp.split('!aesthetic')[1]));
      break;
    case 'futhark':
      args === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(eldF(inp.split('!futhark')[1]));
      break;
    case 'runes':
      args === "" ? input.channel.send("you need an argument after the command, my dude") : input.channel.send(eldF(inp.split('!runes')[1]));
      break;
    case 'freedom':
      args === "" ? input.channel.send("you need a number and unit type after the command, my dude") : client.commands.get('freedom').run(client, input, args);
      break;
    case 'poll':
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
      let tmp = "**" + input.mentions.users.first().username + " has been banned for life by " + input.author.username + "**";
      input.channel.send(tmp.toUpperCase());
      break;
    case 'shutdown':
      shutdown(input)
        .catch(e => {
          console.log(e);
        });
      break;
    case 'reboot':
      reboot(input)
        .catch(e => {
          console.log(e);
        });
      break;
    case 'sa':
      if (isOwner(input) && args[1] === "-p") client.user.setActivity(arguments[0], {type: "PLAYING"});
      else if (isOwner(input) && args[1] === "-w") client.user.setActivity(arguments[0], {type: "WATCHING"});
      else if (isOwner(input) && args[1] === "-l") client.user.setActivity(arguments[0], {type: "LISTENING"});
      break;
    case 'imVegan':
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
  }
}


function isCool(input) {
  //id: <@&458031022563393536>
  return input.member.roles.has('458031022563393536');
}

function isMod(input) {
  //id: <@&458030682988609538>
  return input.member.roles.has('458030682988609538');
}

function isKittelsen(input) {
  return input.author.id === '418100748451315713';
}

function imVeganFunc(on, input, args) {

  let ch = "";

  /*if (args[2]) {
    try {
      ch = input.channels.get(args[2]);
    } catch (e) {
      console.log(e);
    }
  }*/

  let isOn = on;

  if (isOn) {
    let r = Math.floor(Math.random() * 40 * 60 * 60 * 1000); //
    let i = setTimeout(() => {
        //if(!ch) input.channel.send("im vegan");
        //else client.channels.get('458029595145404452').send("im vegaaaaaaaaaaan");
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
    input.channel.send("nice try :)");
  }
};

const reboot = async (input) => {
  if (isOwner(input)) {
    console.log("Reboot signal recieved.");
    input.channel.send("rebooting...")
      .then(() => client.destroy())
      .then(() => client.login(auth));
  } else {
    input.channel.send("nice try :)");
  }
};


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
  }
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

function isOwner(input) {
  return input.author.id === ownerId
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