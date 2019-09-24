const winston = require('winston');

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
module.exports.removeEmojis = (input) => {
  return input.replace(/<(.*?)>/gm, '');
};


module.exports.getEmojis = (input) => {
  //let tmp = input.match(/<(.*?)>/).toString();
  console.log(input.match(/[0-9]+/).toString());

  return input.match(/[0-9]+/).toString();
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
