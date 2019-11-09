const fetch = require('node-fetch');
const Discord = require('discord.js');
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
      //console.log("res: " + res);
      let suc = JSON.stringify(res.success);
      let url = res.list[index].definition;
      //console.log("url: " + url);
      if (url) {
          const emb = new Discord.RichEmbed()
              .setTitle("urban dictionary defintion of: " + inp)
              .setColor("#0e2158")
              .setDescription(url)
              .setFooter("Index: " + index);
          input.channel.send(emb);
          //input.channel.send("__**" + inp + "**__:\n" + url);
      }
      else {
          input.channel.send("something went wrong :( \n" + "ping comradeSeitan#8059 to let him know he fucked up");
      }
    }).catch(error => console.error(error))
};
