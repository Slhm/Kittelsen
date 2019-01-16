
//8Ball
let eightBall = ["Without a doubt.", "Yes.", "Fuck yes.", "Most likely.", "Pretty sure, yeah.", "I think so?", "Absolutely", "Hell yes",
  "if my tasseography skills are on point, my tea cup says yes",
  "That question have remained unsolved for ages, but i believe I have figured out the answer. It is all based on the ancient sciptures of the Wizard Lord NisseFaen. The answer is: fuck yeah, dude",
  "My calculations says no.", "No.", "Don't count on it.", "This rng thing here says no.", "what? idk", "Probably not", "Hell no", ""];

module.exports.run = async (client, input, args) => {

  let r = Math.floor(Math.random() * eightBall.length);
  console.log("r: " + r + "\n eightball length: " + eightBall.length);
  if(r === eightBall.length-1){
    await input.channel.send("hmm, i dont know about that, but i know this one dude who might know. just a sec");
    await args.shift();
    let q = await args.join(" ");
    await input.channel.send("!8 hey drunkBot, do you know: " + q);
  }else{
    let ans = eightBall[r];
    input.channel.send(ans);
  }

};

module.exports.help = {
  name: "8"
};

