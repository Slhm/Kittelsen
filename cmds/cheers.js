module.exports.run = async (client, input, args, con) => {

  let tmpVal = 0;

  if(args[1] === "leaderboard"){
    let lb = "";
    let members = input.guild.members;
    let i = 1;

    await con.query('SELECT * FROM cheers ORDER BY amount DESC', (e, rows) => {

      rows.forEach( (row) => {
        members.forEach( (member) => {
          if(row.id === parseInt(member.user.id)){
            lb += "[" + i + "]   " + "#" + member.user.username + ":\n" +
              "          Amount of cheers: " + row.amount + "\n";
            i++;
          }
        })
      });
      input.channel.send("**Cheers Leader Board:** \n" + "```css\n" + lb + "\n```");
    })
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
      input.channel.send(input.mentions.users.first().username + " has received " + tmpVal + " cheers so far!");
    });
  } else {
    input.channel.send("Cheers, " + input.author.username + "!");
  }
};

module.exports.help = {
  name: "cheers"
};

