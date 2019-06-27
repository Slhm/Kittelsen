const ownerId = require('../auth.json').ownerId;
const dbHelper = require('../dbHelper');

module.exports.run = async (client, input, args, con, arguments) => {

  if (args[1] === "-i" || args[1] === "insert" || args[1] === "add") {
    dbHelper.insertItems('cozy',['link','addedBy'],["\'" + arguments[0] + "\'", "\'" + input.author.username + "\'"],con,input);

  }else if(args[1] === "-l" || args[1] === "list"){
    dbHelper.listLinksInTable('cozy', ['link', 'addedBy'], con, input);

  }else if(isOwner(input) && (args[1] === "rm" || args[1] === "delete")){
    dbHelper.deleteItem('cozy','id = ' + args[2], con, input);

  } else {
    dbHelper.getRandomItem('cozy', con, input);
  }
};

module.exports.help = {
  name: "cozy"
};

function isOwner(input) {
  return input.author.id === ownerId
}
