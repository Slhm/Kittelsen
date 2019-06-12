//regex for strings
function toCurrency(str) {
  return str.match(/[a-z]+/g);
}

//regex for positive, negative numbers, and decimals
function toAmount(str) {
  return str.match(/^-?[0-9]+(\.[0-9])?/g);
}

const listLinksInTable = module.exports.listLinksInTable = async (tableName, con) => {
  await con.query('SELECT * FROM ' + tableName, (e, rows) => {
    let list = "";
    rows.forEach((row, i) => {
      list += i + 1 + ": " + "<" + row.name + ">" + " link: " + row.link + "\n";
    });
    return "items in table: \n" + list;
  })
};

const incrementItemAmount = module.exports.incrementItemAmount = async (tableName, userId, con) => {
  await con.query('SELECT * FROM ' + tableName + ' WHERE userId = ' + userId, (e, rows) => {
    if (e) throw e;

    let q;
    let tmpVal;

    if (rows.length < 1) {
      tmpVal = 1;
      q = 'INSERT INTO ' + tableName + ' (userId, amount) VALUES (' + userId + "," + 1 + ")";
    } else {
      tmpVal = parseInt(rows[0].amount) + 1;
      q = 'UPDATE ' + tableName + ' SET amount = ' + tmpVal + " WHERE userId = " + userId
    }

    con.query(q);
    });
};

const listHighScore = module.exports.listHighScore = async (tableName, typeOfAmount, con, input)  =>{
  let lb = "";
  let members = input.guild.members;
  let i = 1;

  await con.query('SELECT * FROM ' + tableName + ' ORDER BY amount DESC', (e, rows) => {

    rows.forEach( (row) => {
      members.forEach( (member) => {
        if(row.userId === member.user.id.toString()){
          lb += "[" + i + "]   " + "#" + member.user.username + ":\n" +
            "          Amount of " + typeOfAmount + ": " + row.amount + "\n";
          i++;
        }
      })
    });
    input.channel.send("**" + typeOfAmount + " Leader Board:** \n" + "```css\n" + lb + "\n```");
  })
};