const fetch = require('node-fetch');
module.exports.run = async (client, input) => {

  let m = await input.channel.send("fetching definition... ");

  let inp = input.content;
  inp = inp.split('!ud')[1];
  console.log("imp: " + inp);

  await fetchUd(inp, input);

  m.delete();

};

module.exports.help = {
  name: "ud"
};


const fetchUd = async (inp, input) => {

  return fetch('https://api.urbandictionary.com/v0/define?term=' + inp)
    .then(response => response.json())
    .then(res => {
      console.log("res: " + res);
      let suc = JSON.stringify(res.success);
      let url = res.list[0].definition;
      //console.log("url: " + url);
      if (url) input.channel.send("__**" + inp + "**__:\n" + url);
      else input.channel.send("something went wrong :( \n" + "ping noekk#8059 to let him know he fucked up");
    }).catch(error => console.error(error))
};
