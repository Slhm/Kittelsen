const ownerId = require('../auth.json').ownerId;

module.exports.run = async (client, input, args, con) => {


  if (args[1] === "-i") {
    await con.query('INSERT INTO cozy (link) VALUES (' + args[2] + ')', (e, rows) => {
      input.channel.send("more coziness added successfully :3");
    });
  }else if(args[1] === "-l"){
    await con.query('SELECT * FROM cozy', (e, rows) => {
      let list  = "";
      rows.forEach((row, i) => {
        list += i + ": " + "<" + row.link + ">" + "\n";
      });
      input.channel.send("items in db: \n" + list);
    })
  }else if(isOwner(input) && args[1] === "rm"){
    await con.query('DELETE FROM cozy WHERE id = ' + args[2], (e,rows) => {
      input.channel.send("removed item.");
    })
  } else {
    let r;
    await con.query('SELECT COUNT(*) AS count FROM cozy', (e, rows) => {
      r = Math.floor(Math.random() * rows[0].count) + 1;
      //console.log("rows:  " + rows[0].count);
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
