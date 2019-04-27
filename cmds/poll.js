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
  //let lastMsg = input.channel.lastMessageID;
  //let m1 = input.message.emojis.first().name;
  await msg.react("👍");
  await msg.react("👎");

  //await input.delete(input.message_id);
  //await input.channels.channel_id(input.channel.channel_id).messages.message_id(lastMsg).react("👍");
  /*
  msg.react("👍");
  msg.react("👎");
  */



  //input.channel.send(input.author.username + " created a poll on: \n\n" + "**" + arguments + "**");
  //input.react("👍");
  //let botObj = get().users.user_id('418100748451315713');
  //botObj.last_message_id

  //message.author.id.react('👍');
  //input.channel.reactions(':thumbsup:');

};

module.exports.help = {
  name: "poll"
};

