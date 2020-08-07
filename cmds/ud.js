const fetch = require('node-fetch');
const Discord = require('discord.js');
const ownerName = require('../config.json').ownerName;

// AwS complained about bad ssl-certificates, and this is a workaround i found.
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();


module.exports.run = async (client, input) => {

  let m = await input.channel.send("fetching definition... ");

  let inp = input.content;
  inp = inp.split('!ud ')[1];
  let index = 0;
  if(inp.includes("-i")) {
      index = inp.split("-i")[1].substring(1,2);
      inp = inp.split("-i")[0];
  }
  //console.log("imp: " + inp);

  await fetchUd(inp, input, index);

  m.delete();

};

module.exports.help = {
  name: "ud"
};


const fetchUd = async (inp, input, index) => {

  return fetch('https://api.urbandictionary.com/v0/define?term=' + inp)
    .then(response => response.json())
    .then(res => {
      console.log("res: " + res);
      let suc = JSON.stringify(res.success);
      console.log(suc);
      let url = res.list[index].definition;
      let word = res.list[index].word;
      //console.log("res.list: " + res.list[0]);
      if (url) {
          const emb = new Discord.RichEmbed()
              .setTitle("Urban Dictionary, closest match: \n" + word)
              .setColor("#0e2158")
              .setDescription(url)
              .setFooter("Index: " + index + ". \nAdd -i N at the end for Nth index.");
          input.channel.send(emb);
          //input.channel.send("__**" + inp + "**__:\n" + url);
      }
      else {
          input.channel.send("something went wrong :( \n" + "this is most likely that there is no entry for the query. if its actually a bug, ping " + ownerName);
      }
    }).catch(error => {
	    input.channel.send("something went wrong :( \nmaybe entry doesnt exist or api is down. if actual bug ping " + ownerName);
	    console.error(error);
    })
};
