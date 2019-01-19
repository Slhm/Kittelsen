
//8Ball
let eightBall = ["Without a doubt.", "Yes.", "Fuck yes.", "Most likely.", "Pretty sure, yeah.", "I think so?", "Absolutely", "Hell yes",
  "if my tasseography skills are on point, my tea cup says yes",
  "That question have remained unsolved for ages, but i believe I have figured out the answer. It is all based on the ancient sciptures of the Wizard Lord NisseFaen. The answer is: fuck yeah, dude",
  "My calculations says no.", "No.", "Don't count on it.", "This rng thing here says no.", "what? idk", "Probably not", "Hell no","NO GOD NO. PLEASE GOD. NOOOOOOOOO","that's a no from me", ""];

let umulig = false;

module.exports.run = async (client, input, args, con) => {

  let r = Math.floor(Math.random() * eightBall.length);

  //console.log("r: " + r + "\n eightball length: " + eightBall.length);
  if(r === eightBall.length-1){
    await input.channel.send("hmm, i dont know about that, but i know this one dude who might know. just a sec");
    await args.shift();
    let q = await args.join(" ");
    await input.channel.send("!8 **hey drunkBot, do you know: " + q + "**");
    if(!umulig) umulig = true;
    else{
      await con.query('SELECT num FROM eight WHERE id = 11', (e,rows) =>{
        if(e) throw e;
        let tmp = parseInt(rows[0].num);
        con.query('UPDATE eight SET num = ' + tmp+1 + ' WHERE id = 11');
        console.log(rows[0].num);
        input.channel.send("<@!306056522020945922> nice, it happened. there's a 0.3% ((1/18)^2) chance of this happening. it has happened: " + tmp + " times before.");
      });
      umulig = false;
    }
  }else{
    let ans = eightBall[r];
    //input.channel.send("```" + ans + "```");
    input.channel.send(ans);
    umulig = false;
  }

};

module.exports.help = {
  name: "8"
};

