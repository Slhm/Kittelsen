const dbHelper = require('../dbHelper');
const funcHelper = require('../funcHelper');
const Discord = require('discord.js');

module.exports.run = async (client, input, args, con, arguments) => {

  let flag = args[1];
  if(args[1] === "leaderboard"){
    dbHelper.listHighScore('cheers', 'cheers', con, input);
  } else if (input.mentions.users.first()) {
    await dbHelper.incrementAmount('cheers',input.mentions.users.first().id,con)
      .then(amount => {
        dbHelper.getRandomItem('cheersList', con, input, 'text')
            .then(text => {
	      const emb = new Discord.RichEmbed()
		    .setFooter(funcHelper.getNickName(input, input.mentions.users.first().id) + " has received " + amount.toString() + " cheers for far!")
		    //.setTitle("A cheers has happened!")
		    .setDescription("🍻 " + "**" + funcHelper.getNickName(input, input.author.id) + "**" + " and " + "**" +  funcHelper.getNickName(input, input.mentions.users.first().id) + "**" + " 🍻" + " " +  text) 
		    .setColor("#66ff90");
	      input.channel.send(emb);
              //input.channel.send("🍻 " + "**" + funcHelper.getNickName(input, input.author.id) + "**" + " and " + "**" +  funcHelper.getNickName(input, input.mentions.users.first().id) + "**" + " 🍻" + " " +  text + "\n" + "** " + funcHelper.getNickName(input, input.mentions.users.first().id) + " **"  + " has received " + amount.toString() + " cheers so far!");
            });
      });
  }else if (funcHelper.isOwner(input) && (flag === "-i" || flag === "--insert")) arguments[0] ? dbHelper.insertItems("cheersList", ["text"], ["'" + arguments[0] + "'"], con, input) : input.channel.send("no arguments given.");
  else if (funcHelper.isOwner(input) && (flag === "-l" || flag === "--list")) dbHelper.listLinksInTable("cheersList", ["id", "text"], con, input);
  else if (funcHelper.isOwner(input) && (flag === "rm" || flag === "--remove")) await dbHelper.deleteItem("cheersList", 'id = ' + args[2], con, input);
  else if (funcHelper.isOwner(input) && (flag === "-h" || flag === "--help")) input.channel.send("**!cheers -i TEXT_HERE** to insert new item \n**!cheers -l** for list \n**!cheers rm ID_HERE** to remove DB item");
 
  else {
    input.channel.send("Cheers, " + input.author.username + "!");
  }
};

module.exports.help = {
  name: "cheers"
};

