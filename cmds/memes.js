const fetch = require('node-fetch');
const imgflip = require('../auth.json').imgflip;

//Memes
let memeArray = ["pikachu", "exit", "spongebob", "buttons"];
let memeArrayID = [155067746, 124822590, 102156234, 87743020];

module.exports.run = async (client, input, args, arguments) => {

  console.log("memes my dude");
  for(let i = 0; i <= 3; i++) {
    if (!arguments[i]) arguments[i] = " ";
  }
  let m = await input.channel.send("fetching meme... ");

  for (let i = 0; i <= memeArray.length; i++) {
    if (memeArray[i] === args[1]) {

      if(args[1] === "pikachu" || args[1] === "exit"){
        let box = args[1] === "pikachu" ? "pikachu" : "exit";
        await fetchMeme(input, memeArrayID[i], arguments[0], arguments[1], arguments[2], box);
        break;
      }else{
        await fetchMeme(input, memeArrayID[i], arguments[0], arguments[1]);
        break;
      }
    } else if (i >= memeArray.length) {
      input.channel.send("Couldnt find that. Try one of these: \n" +
        memeArray + "\n" +
        "Syntax example: !memes aliens 'top text' 'bottom text'");
      break;
    }
  }
  m.delete();

};

module.exports.help = {
  name: "memes"
};


const fetchMeme = async (input, type, _text0, _text1, _text2, box) => {

  //let text = "&text0="+_text0+"&text1="+_text1+"&text2="+_text2;
  let text = "&boxes[0][text]="+_text0+"&boxes[1][text]="+_text1+"[height]=548";
  if(_text2) text += "&boxes[2][text]="+_text2;
  return fetch('https://api.imgflip.com/caption_image?' +
    'username=' + imgflip.user +
    '&password=' + imgflip.pass +
    '&template_id=' + type +
    text)
    .then(response => response.json())
    .then(res => {
      let suc = JSON.stringify(res.success);
      let url = res.data.url;
      if (suc === 'true') input.channel.send(url);
      else input.channel.send("something went wrong :( \n" + "ping noekk#8059 to let him know he fucked up");
    }).catch(error => console.error(error))
};
