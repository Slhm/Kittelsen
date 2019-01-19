module.exports.run = async (client, input, args, con) => {

  let tmpVal = 0;
  //console.log(input.mentions.users.first().id);

  //if (input.mentions == null || args[1] === null || !input.mentions) {
  if (input.mentions.users.first()) {
    await con.query('SELECT * FROM cheers WHERE id = ' + input.mentions.users.first().id, (e, rows) => {
      if (e) throw e;

      let q;

      if (rows.length < 1) {
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

