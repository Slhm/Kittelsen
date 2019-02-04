const ownerId = require('../auth.json').ownerId;

module.exports.run = async (client, input, args, con, arguments) => {

  if (args[1] === "-i") {
    await con.query('INSERT INTO cozy (link, addedBy) VALUES (\"' + arguments[0] + '\", \"' + input.author.username + '\")', (e, rows) => {
      input.channel.send("more coziness added successfully :3");
    });
  }else if(args[1] === "-l"){
    await con.query('SELECT * FROM cozy', (e, rows) => {
      let list  = "";
      rows.forEach((row, i) => {
        list += i+1 + ": " + "<" + row.link + ">" + " added by: " + row.addedBy + "\n";
      });
      input.channel.send("items in db: \n" + list);
    })
  }else if(isOwner(input) && args[1] === "rm"){
    await con.query('DELETE FROM cozy WHERE id = ' + args[2], (e,rows) => {
      if(e) input.channel.send("error: " + e);
      else{
      input.channel.send("removed item.");
      con.query('SET @count = 0;');
      con.query('UPDATE cozy SET cozy.id = @count := @count + 1;');
      con.query('ALTER TABLE cozy AUTO_INCREMENT = 1');
      }
    })
  } else {
    let r;
    await con.query('SELECT COUNT(*) AS count FROM cozy', (e, rows) => {
      r = Math.floor(Math.random() * rows[0].count) + 1;
      //console.log("rows:  " + rows[0].count);
      let q = 'SELECT * FROM cozy WHERE id = ' + r;
      con.query(q, (e, row) => {
        //console.log("r: " + r + "\nlink: " + rows + ", link[0]: " + rows[0].link);
        input.channel.send(row[0].link + " added by: " + row[0].addedBy + " uwu");
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
