const fetch = require('node-fetch');
const imgflip = require('../auth.json').imgflip;

//Memes
let memeArray = ["boromir", "aliens", "spongebob"];
let memeArrayID = [61579, 101470, 102156234];

module.exports.run = async (client, input, args, arguments) => {
  console.log("memes my dude");

  //input.channel.send("fetching meme, just a sec");
  //fetchMeme(input, memeArrayID[0], arguments[0], arguments[1]);

  for (let i = 0; i <= memeArray.length; i++) {
    if (memeArray[i] === args[1]) {

      input.channel.send("fetching meme, just a sec");
      //fetchMeme(input, "101470", "svarte faens: ", "svupp");
      fetchMeme(input, memeArrayID[i], arguments[0], arguments[1]);
      break;
    } else if (i >= memeArray.length) {
      input.channel.send("Couldnt find that. Try one of these: \n" +
        memeArray + "\n" +
        "Syntax example: !memes aliens 'top text' 'bottom text'");
      break;
    }
  }

};

module.exports.help = {
  name: "memes"
};






//var memePromise = new Promise(function(fetchMeme(), failFetchMeme(input))
/*
const failFetchMeme = (input) => {
    input.channel.send("fetching of meme failed");
};
*/
const fetchMeme = async (input, type, _text0, _text1) => {

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
