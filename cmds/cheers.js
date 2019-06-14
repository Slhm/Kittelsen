const dbHelper = require('../dbHelper');

module.exports.run = async (client, input, args, con) => {


  let ch = [
    "cheered so hard it was heard way down the hallway. some say the echo is still down there somewhere.",
    "punched the shit out of their glasses so it all broke, but it was all worth it for a magnificent cheer",
    "cheered.",
    "cheered, and it was cool.",
    "cheered their tiny apple juice glasses together. it's something i guess.",
    "tried to cheer, but they missed. i guess it counts anyways, fuck it.",
    "cheered quietly.",
    "cheered REALLY FUCKING LOUDLY.",
    "cheered at a moderate volume. it was an extraordinarily ordinary cheer.",
    "cheered their bath salts bags together, and then spazzed out and ODed probably",
    "are so high that even if they tried to cheer or some shit, they would probably forget what they were doing before the glasses hit. but it still counts in my book",
    "are dead from alcohol poisoning."
  ];

  let tmpVal = 0;

  if(args[1] === "leaderboard"){
    dbHelper.listHighScore('cheers', 'cheers', con, input);
  }
  else if (input.mentions.users.first()) {
    await con.query('SELECT * FROM cheers WHERE id = ' + input.mentions.users.first().id, (e, rows) => {
      if (e) throw e;

      let q;

      if (rows.length < 1) {
        tmpVal = 1;
        q = 'INSERT INTO cheers (id, amount) VALUES (' + input.mentions.users.first().id + "," + 1 + ")";
      } else {
        tmpVal = parseInt(rows[0].amount) + 1;
        q = 'UPDATE cheers SET amount = ' + tmpVal + " WHERE id = " + input.mentions.users.first().id;
      }

      con.query(q);
      let r = Math.floor(Math.random() * ch.length);
      input.channel.send(input.author.username + " and " + input.mentions.users.first().username + " " +  ch[r] + "\n" + input.mentions.users.first() + " has received " + tmpVal + " cheers so far!");
    });
  } else {
    input.channel.send("Cheers, " + input.author.username + "!");
  }
};

module.exports.help = {
  name: "cheers"
};