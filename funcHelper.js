const winston = require('winston');
const ownerId = require('./auth.json').ownerId;

module.exports.logInfo = async (input) => {
  logger.log({
    level: 'info',
    date: getDate(),
    user: input.author.username,
    guild: input.channel.type !== "dm" ? input.guild.name + ", " + input.channel.name : "dm",
    inp: input.content
  })
};

module.exports.logWarning = async (input) => {
  logger.log({
    level: 'warn',
    date: getDate(),
    user: input.author.username,
    guild: input.channel.type !== "dm" ? input.guild.name + ", " + input.channel.name : "dm",
    inp: input.content
  })
};

module.exports.logError = async (eMsg) => {
  logger.log({
    level: 'error',
    date: getDate(),
    error: eMsg
  })
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service'},
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
    new winston.transports.File({ filename: './logs/warnings.log', level: 'warn' })
  ]
});


function getDate(){
  return new Date().toLocaleString( {timeZone: "Norway/Oslo"})
}

module.exports.containsQuotes = (str) => {
  return (str.contains("\"") || str.contains("'") || str.contains("“"));
};

//Regex for removing emojis in a text
module.exports.removeEmojis = (text) => {
  return text.replace(/<(.*?)>/gm, '');
};

module.exports.getEmojiUrl = (text, isGlobal) => {
	console.log("text: " + text);
	return (isGlobal ? "https://cdn.discordapp.com/assets/" + text : "https://cdn.discordapp.com/emojis/" + text);

    //return (isGlobalEmoji(text) ? "https://cdn.discordapp.com/assets/" + text : "https://cdn.discordapp.com/emojis/" + text);
};

module.exports.getEmojis = (text, isGlobal) => {
    //let tmp = input.match(/<(.*?)>/).toString();
    //console.log(input.match(/[0-9]+/).toString());

  return text.match(/[0-9]+/).toString();
};

module.exports.isGlobalEmoji = (text) => {
    return text.includes("assets");
};

module.exports.getFileExtention = (text) => {
    return text.match(/[^.]+$/gm).toString;
};

//TODO: get vcj modID
module.exports.isvcjMod = (input) => {
  //if(input.member.roles.has(''));
};

//checks for mod role
module.exports.isMod = (input) => {
  return input.member.roles.has('458030682988609538');
};

//checks for "new-person" role
module.exports.isNew = (input) => {
  return input.member.roles.has('458334852874371093');
};

//checks if an id is the bot id
module.exports.isKittelsen = (input) => {
  return input.author.id === '418100748451315713';
};

//checks if id is of the bot owner
module.exports.isOwner = (input) => {
  return input.author.id === ownerId
};


/*


module.exports.getEmojis = (input) => {
  console.log("input in getEmojis: " + input);
  let tmp = input.match(/<(.*?)>/).toString();
  console.log("after first regex: " + tmp);
  console.log("after second: " + tmp.match(/[0-9]+/).toString());
  tmp = tmp.match(/[0-9]+/).toString();
  return tmp;
}
 */

module.exports.makeArgument = (array, index) =>{
  array.splice(0,index);
  return array.join(' ').toString();
};

logger.add(new winston.transports.Console());
