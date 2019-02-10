module.exports.run = async (client, input, args) => {
  console.log("freedom my dude");

  if (!args[1]) {
    input.channel.send("Freedom units to metric calculator.\n" +
      "These convertions are available so far:\n" +
      "mph to mps\n" +
      "F to C\n" +
      "C to F\n" +
      "syntax: NUMBER[F / mph / lbs / oz)");
  } else if (args[1].endsWith("F")) {
    let F = args[1].slice(0, -1);
    let C = Math.round(((F - 32) * 5 / 9) * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + C + "C");

  } else if (args[1].endsWith("mph")) {
    let mph = args[1].slice(0, -3);
    let mps = Math.round(mph * 0.44704 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + mps + " meters/second");

  }else if(args[1].endsWith("lbs")){
    let lbs = args[1].slice(0,-3);
    let kg = Math.round(lbs * 0.4535924 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kg + "kg");

  }else if(args[1].endsWith("oz")){
    let oz = args[1].slice(0,-2);
    let l = Math.round(oz * 0.0284131 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + l + " liters");
  }else if(args[1].endsWith("C")){
    let c = args[1].slice(0,-1);
    let f = Math.round((c * 9/5) + 35);
    input.channel.send(args[1] + "in freedoms is: " + f  + "F");
  }
  else input.channel.send("try again. Syntax: NUMBER[F/mph]");

};

module.exports.help = {
  name: "freedom"
};

