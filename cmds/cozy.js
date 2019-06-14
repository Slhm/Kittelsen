const ownerId = require('../auth.json').ownerId;
const dbHelper = require('../dbHelper');

module.exports.run = async (client, input, args, con, arguments) => {

  if (args[1] === "-i" || args[1] === "insert" || args[1] === "add") {
    await con.query('INSERT INTO cozy (link, addedBy) VALUES (\"' + arguments[0] + '\", \"' + input.author.username + '\")', (e, rows) => {
      input.channel.send("more coziness added successfully :3");
    });
  }else if(args[1] === "-l" || args[1] === "list"){
    dbHelper.listLinksInTable('cozy', ['link', 'addedBy'], con, input);

  }else if(isOwner(input) && (args[1] === "rm" || args[1] === "delete")){
    dbHelper.deleteItem('cozy','id = ' + args[2], con, input);

  } else {
    dbHelper.getRandomItem('cozy', con, input);
    //let r;
    //await con.query('SELECT COUNT(*) AS count FROM cozy', (e, rows) => {
    //  r = Math.floor(Math.random() * rows[0].count) + 1;
    //  //console.log("rows:  " + rows[0].count);
    //  let q = 'SELECT * FROM cozy WHERE id = ' + r;
    //  con.query(q, (e, row) => {
    //    //console.log("r: " + r + "\nlink: " + rows + ", link[0]: " + rows[0].link);
    //    input.channel.send(row[0].link + " added by: " + row[0].addedBy + " uwu");
    //  });
    //});
  }
};

module.exports.help = {
  name: "cozy"
};

function isOwner(input) {
  return input.author.id === ownerId
}
