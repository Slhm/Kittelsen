const winston = require('winston');

module.exports.logInfo = async (input) => {
  logger.log({
    level: 'info',
    date: Date.now(),
    user: input.author.username,
    guild: input.channel.type !== "dm" ? input.guild.name + ", " + input.channel.name : "dm",
    inp: input.content
  })
};

module.exports.logWarning = async (input) => {
  logger.log({
    level: 'warn',
    date: Date.now(),
    user: input.author.username,
    guild: input.channel.type !== "dm" ? input.guild.name + ", " + input.channel.name : "dm",
    inp: input.content
  })
};

module.exports.logError = async (eMsg) => {
  logger.log({
    level: 'error',
    date: Date.now(),
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
logger.add(new winston.transports.Console());