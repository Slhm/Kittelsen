const fetch = require('node-fetch');
const imgflip = require('../auth.json').imgflip;
const Discord = require('discord.js');


module.exports.run = async (client, input, args, arguments) => {
  //console.log("poll my dude");

  const emb = new Discord.RichEmbed()
    .setFooter("poll by " + input.author.username)
    .setTitle(arguments[0])
    //.setImage(input.author.displayAvatarURL)
    .setColor("#66ff99");

  console.log(arguments[0]);
  let msg = await input.channel.send(emb);

  let emojis = input.content.split(arguments[0])[1];
  console.log("emojis: " + emojis);
  let emojiList = emojis.split(" ");
  emojiList.splice(0,1);
  for(let i = 0; i < emojiList.length; i++){
    if(emojiList[i].includes("<")) await msg.react(emojiList[i].match(/[0-9]+/).toString());
    else await msg.react(emojiList[i]);
  }

  if(emojiList.length === 0) {
    await msg.react("👍");
    await msg.react("👎");
  }
};

module.exports.help = {
  name: "poll"
};

