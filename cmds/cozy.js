const ownerId = require('../auth.json').ownerId;
const dbHelper = require('../dbHelper');
const funcHelper = require('../funcHelper');

module.exports.run = async (client, input, args, con, arguments) => {

  let queryLink = arguments[0];
  let arg = args[1];
  let delIndex = args[2];
  if(!arguments[0]){
    queryLink = funcHelper.makeArgument(args,2);
  }


  if (funcHelper.isCool(input) && (arg === "-i" || arg === "insert" || arg === "add")) {
    dbHelper.insertItems('cozy',['link','addedBy'],["\'" + queryLink + "\'", "\'" + input.author.username + "\'"],con,input);

  }else if(isOwner(input) && (arg === "-l" || arg === "list")){
    dbHelper.listLinksInTable('cozy', ['link', 'addedBy'], con, input);

  }else if(isOwner(input) && (arg === "rm" || arg === "delete")){
    dbHelper.deleteItem('cozy','id = ' + delIndex, con, input);

  } else {
    let m  = "";
    await dbHelper.getRandomItem('cozy', con, input, 'link')
        .then(link => {
          m = link;
        });
    input.channel.send(m);
  }
};

module.exports.help = {
  name: "cozy"
};

function isOwner(input) {
  return input.author.id === ownerId
}
