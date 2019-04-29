const ownerId = require('../auth.json').ownerId;

//8Ball
let eightBall = ["Without a doubt.", "Yes.", "Fuck yes.", "Most likely.", "Pretty sure, yeah.", "I think so?", "Ja for faen", "oui",
  "if my tasseography skills are on point, my tea cup says yes",
  "That question have remained unsolved for ages, but i believe I have figured out the answer. It is all based on the ancient scriptures of the Wizard Lord Yourofsky-chan. The answer is: fuck yeah, dude",
  "My calculations says no.", "No.", "Don't count on it.", "This rng thing here says no.", "what? idk", "Probably not", "Hell no", "NO GOD NO. PLEASE GOD. NOOOOOOOOO", "that's a no from me", ""];

let double = false;

module.exports.run = async (client, input, args, con) => {

  await args.shift();
  let q = await args.join(" ");
  if (q.includes(' or ')) orFunc(input, q);
  else {

    let r = Math.floor(Math.random() * eightBall.length);

    //This is for the last element in the array. It's a loop that asks the bot again.
    if (r === eightBall.length - 1) {
      await input.channel.send("hmm, i dont know about that, but i know this one dude who might know. just a sec");

      await input.channel.send("!8 **hey, drunkBot. do you know: ** " + q);

      //It sets the var double to true, so that it can know if it happens two times in a row.
      if (!double) double = true;

      //If double is true, it means it has looped back once, and it has hit the last element again.
      //This fetches a variable in the database to display how many times it has happened, adds 1, and pings the owner.
      else {
        await con.query('SELECT num FROM eight WHERE id = 11', (e, rows) => {
          if (e) throw e;
          let tmp = parseInt(rows[0].num);
          con.query('UPDATE eight SET num = ' + tmp + 1 + ' WHERE id = 11');
          //console.log(rows[0].num);
          let chance = Math.pow(1 / eightBall.length, 2);
          input.channel.send("<@!" + ownerId + ">, it happened. there's a " + chance + "% chance of this happening. it has happened: " + tmp + " times before.");
        });
        double = false;
      }
    } else {
      let ans = eightBall[r];
      //input.channel.send("```" + ans + "```");
      input.channel.send(ans);
      double = false;
    }
  }
};

function orFunc(input, q) {

  let op1 = "**" + q.split(' or ')[0] + "**";
  let op2 = "**" + q.split(' or ')[1] + "**";


  input.channel.send(Math.random() > 0.5 ? op1 + " all the way, dude" : op2 + " all the way, dude");
}

module.exports.help = {
  name: "8"
};

