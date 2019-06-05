const ownerId = require('../auth.json').ownerId;
const Discord = require('discord.js');

module.exports.run = async (client, input, args, con, arguments) => {

  if (args[1] === "-i" || args[1] === "insert" || args[1] === "add") {
    await con.query('INSERT INTO ama (question, addedBy) VALUES (\"' + arguments[0] + '\", \"' + input.author.username + '\")', (e, rows) => {
      input.channel.send("question added successfully");
    });
  }else if(args[1] === "-l"){
    await con.query('SELECT * FROM ama', (e, rows) => {
      let list  = "";
      rows.forEach((row, i) => {
        list += i+1 + ": " + "<" + row.question + ">" + " added by: " + row.id + "\n";
      });
      input.channel.send("items in table: \n" + list);
    })
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
