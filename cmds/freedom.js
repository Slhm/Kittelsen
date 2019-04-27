module.exports.run = async (client, input, args) => {
  console.log("freedom my dude");

  if (!args[1]) {
    input.channel.send("Freedom units to metric calculator and vice versa.\n" +
      "These convertions are available so far:\n" +
      "mph - kph\n" +
      "F - C\n" +
      "lbs - kg\n" +
      "syntax example !freedom 10F");
  } else if (args[1].endsWith("F")) {
    let F = args[1].slice(0, -1);
    let C = Math.round(((F - 32) * 5 / 9) * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + C + "C");

  }else if(args[1].endsWith("C")){
    let c = args[1].slice(0,-1);
    let f = Math.round((c * 9/5) + 35);
    input.channel.send(args[1] + "in freedoms is: " + f  + "F");
  } else if (args[1].endsWith("mph")) {
    let mph = args[1].slice(0, -3);
    let kph = Math.round(mph * 0.44704 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kph + " km/hour");

  }else if (args[1].endsWith("kph")) {
    let kph = args[1].slice(0, -3);
    let mph = Math.round(kph * 1.609344 * 10) / 10;
    input.channel.send(args[1] + " in freedomUnits is: " + mph + " miles/hour");

  }else if(args[1].endsWith("lbs")){
    let lbs = args[1].slice(0,-3);
    let kg = Math.round(lbs * 0.4535924 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kg + "kg");

  }else if(args[1].endsWith("kg")){
    let kg = args[1].slice(0,-2);
    let lbs = Math.round(kg * 2.204623 * 10) / 10;
    input.channel.send(args[1] + " in freedomUnits is: " + lbs + "lbs");

  }else if(args[1].endsWith("oz")){
    let oz = args[1].slice(0,-2);
    let l = Math.round(oz * 0.0284131 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + l + " liters");

  }else if(args[1].endsWith("l")){
    let l = args[1].slice(0,-2);
    let oz = Math.round(l * 33.81413 * 10) / 10;
    input.channel.send(args[1] + " in freedomUnits is: " + oz + " oz");
  }
  else input.channel.send("try again. Syntax example: !freedom 10F");

};

module.exports.help = {
  name: "freedom"
};

