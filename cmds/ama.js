const ownerId = require('../auth.json').ownerId;
const Discord = require('discord.js');
const dbHelper = require('../dbHelper');

module.exports.run = async (client, input, args, con, arguments) => {

  if (args[1] === "-i" || args[1] === "insert" || args[1] === "add") {
    dbHelper.insertItems('ama',['question','addedBy'],["\'" + arguments[0] + "\'", "\'" + input.author.username + "\'"],con,input);

  }else if(args[1] === "-l"){
    dbHelper.listLinksInTable('ama',['question','addedBy'],con,input);

  }else {
    let r;
    await con.query('SELECT COUNT(*) AS count FROM ama', (e, rows) => {
      r = Math.floor(Math.random() * rows[0].count) + 1;
      //console.log("rows:  " + rows[0].count);
      let q = 'SELECT * FROM ama WHERE id = ' + r;
      con.query(q, (e, row) => {
        //console.log("r: " + r + "\nlink: " + rows + ", link[0]: " + rows[0].link);
        const emb = new Discord.RichEmbed()
          .setFooter("question asked by " + row[0].addedBy)
          .setTitle(row[0].question)
          //.setImage(input.author.displayAvatarURL)
          .setColor("#0099ff");
        input.channel.send(emb);
        //input.channel.send(row[0].question + " added by: " + row[0].addedBy + " uwu");
      });
    });
  }
};

module.exports.help = {
  name: "ama"
};

function isOwner(input) {
  return input.author.id === ownerId
}
