const ownerId = require('../auth.json').ownerId;
const Discord = require('discord.js');
const dbHelper = require('../dbHelper');
const fh = require('../funcHelper');

module.exports.run = async (client, input, args, con, arguments) => {
  input.channel.send("time is: ADVENTURE TIME");
};

module.exports.help = {
  name: "time"
};
