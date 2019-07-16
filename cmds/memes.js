const fetch = require('node-fetch');
const imgflip = require('../auth.json').imgflip;
const ownerId = require('../auth.json').ownerId;
const dbHelper = require('../dbHelper');

//Memes
let memeArray = ["pikachu", "exit", "spongebob", "buttons", "truth", "win", "kermit", "depdonald"];
let memeArrayID = [155067746, 124822590, 102156234, 87743020, 123999232, 101910402, 84341851, 173067708];

module.exports.run = async (client, input, args, arguments, con) => {



  args[1] = args[1].toLowerCase();

  if (args[1] === "-i" || args[1] === "insert" || args[1] === "add") {
    //console.log("arg1: " + arguments[0] + "\nargs2: " + arguments[1] + "\narg3: " + arguments[2]);
    dbHelper.insertItems('memes',['name','numText','link'],["\'" + arguments[0] + "\'","\'" + arguments[1] + "\'", "\'" + arguments[2] + "\'"],con,input);

  } else if (args[1] === "-l" || args[1] === "list") {
    dbHelper.listLinksInTable('memes', ['name', 'link'], con, input);

  } else if (isOwner(input) && (args[1] === "rm" || args[1] === "delete")) {
    dbHelper.deleteItem('memes','id = ' + args[2], con, input);

  } else {
    let f = false;
    console.log("args[1]: " + args[1]);
    console.log("args[1]: " + toLetters(args[1]));

    await con.query('SELECT name, link, numText FROM memes', (e, rows) => {
      // WHERE name = "' + toLetters(args[1]) + '"'
      rows.forEach(el => {
        //console.log("el.name: " + el.name);
        //console.log("toLetters(args): " + toLetters(args[1]));
        if(el.name === args[1] && el.numText === 2) {
          f = true;
          fetchMeme(input, el.link, arguments[0], arguments[1]);
        }
        else if(el.name === args[1] && el.numText === 3) {
          fetchMeme(input, el.link, arguments[0], arguments[1], arguments[2]);
          f = true;
        }
      });
      if(!f) input.channel.send("item not found. check bottom of #info");
    });

  }
};

module.exports.help = {
  name: "memes"
};


const fetchMeme = async (input, type, _text0, _text1, _text2) => {
  console.log("inne i fetch. link: " + type);
  let msg = await input.channel.send("fetching meme..");

  //let text = "&text0="+_text0+"&text1="+_text1+"&text2="+_text2;
  let text = "&boxes[0][text]=" + _text0 + "&boxes[1][text]=" + _text1;
  if (_text2) text += "&boxes[2][text]=" + _text2;
  return fetch('https://api.imgflip.com/caption_image?' +
    'username=' + imgflip.user +
    '&password=' + imgflip.pass +
    '&template_id=' + type +
    text)
    .then(response => response.json())
    .then(res => {
      let suc = JSON.stringify(res.success);
      let url = res.data.url;
      if (suc === 'true') {
        input.channel.send(url);
        msg.delete();
      }
      else input.channel.send("something went wrong :( \n" + "ping noekk#8059 to let him know he fucked up");
    }).catch(error => console.error(error))
};

function isOwner(input) {
  return input.author.id === ownerId
}

//regex for strings
function toLetters(str) {
  return str.match(/[a-z]+/g);
}
