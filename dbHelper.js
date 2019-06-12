//regex for strings
function toCurrency(str) {
  return str.match(/[a-z]+/g);
}

//regex for positive, negative numbers, and decimals
function toAmount(str) {
  return str.match(/^-?[0-9]+(\.[0-9])?/g);
}

const listAllItemsInTable = async (tableName) => {
  await con.query('SELECT * FROM ' + tableName, (e, rows) => {
    let list = "";
    rows.forEach((row, i) => {
      list += i + 1 + ": " + "<" + row.name + ">" + " link: " + row.link + "\n";
    });
    input.channel.send("items in table: \n" + list);
  })
};