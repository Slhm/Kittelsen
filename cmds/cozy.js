const ownerId = require('../auth.json').ownerId;

module.exports.run = async (client, input, args, con) => {


  if (isOwner(input) && args[1] === "-i") {
    await con.query('INSERT INTO cozy (link) VALUES (' + args[2] + ')', (e, rows) => {
      input.channel.send("more coziness added successfully :3");
    });
  } else {
    let r;
    await con.query('SELECT COUNT(*) AS count FROM cozy', (e, rows) => {
      r = Math.floor(Math.random() * rows[0].count) + 1;
      console.log("rows:  " + rows[0].count);
      let q = 'SELECT link FROM cozy WHERE id = ' + r;
      con.query(q, (e, rows) => {
        //console.log("r: " + r + "\nlink: " + rows + ", link[0]: " + rows[0].link);
        input.channel.send("cozy shit: " + rows[0].link);
      });
    });
  }
};

module.exports.help = {
  name: "cozy"
};

function isOwner(input) {
  return input.author.id === ownerId
}
