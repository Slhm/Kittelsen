const fetch = require('node-fetch');
const imgflip = require('../auth.json').imgflip;
const Discord = require('discord.js');
const funcHelper = require('../funcHelper');

module.exports.run = async (client, input, args, arguments) => {
  //console.log("poll my dude");

  let pollTitle = arguments[0];
  if(!arguments[0]){
    pollTitle = funcHelper.makeArgument(args,1);
    pollTitle = funcHelper.removeEmojis(pollTitle);
  }

  const emb = new Discord.RichEmbed()
    .setFooter("poll by " + input.author.username)
    .setTitle(pollTitle)
    //.setImage(input.author.displayAvatarURL)
    .setColor("#66ff99");

  //console.log(arguments[0]);
  let msg = await input.channel.send(emb);

  let emojis = input.content.split(pollTitle)[1];
  console.log("emojis: " + emojis);
  let emojiList = emojis.split(" ");
  emojiList.splice(0,1);
  for(let i = 0; i < emojiList.length; i++){
    if(emojiList[i].includes("<")) await msg.react(emojiList[i].match(/[0-9]+/).toString());
    else await msg.react(emojiList[i]);
  }

  if(!emojiList.length) {
    await msg.react("👍");
    await msg.react("👎");
  }
};

module.exports.help = {
  name: "poll"
};

