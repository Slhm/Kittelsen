const dbHelper = require('../dbHelper');

module.exports.run = async (client, input, args, con) => {

  if(args[1] === "leaderboard"){
    dbHelper.listHighScore('cheers', 'cheers', con, input);
  }
  else if (input.mentions.users.first()) {
    await dbHelper.incrementAmount('cheers',input.mentions.users.first().id,con)
      .then(amount => {
        dbHelper.getRandomItem('cheersList', con, input, 'text')
            .then(text => {
              input.channel.send(input.author.username + " and " + input.mentions.users.first().username + " " +  text + "\n" + input.mentions.users.first() + " has received " + amount.toString() + " cheers so far!");
            });
      });
  } else {
    input.channel.send("Cheers, " + input.author.username + "!");
  }
};

module.exports.help = {
  name: "cheers"
};

