const fetch = require('node-fetch');
const fs = require('fs');

module.exports.run = async (client, input, args) => {
  console.log("freedom my dude");
  args[1] = args[1].toLowerCase();
  if (args[2]) args[1] = args[1] + args[2];

  if (!args[1]) {
    input.channel.send("Freedom units to metric calculator and vice versa.\n" +
      "These convertions are available so far:\n" +
      "m(ph) - k(ph)\n" +
      "F - C\n" +
      "lbs - kg\n" +
      "syntax example !freedom 10F");

  } else if (args[1].endsWith("f")) {
    let F = toAmount(args[1]);
    let C = Math.round(((F - 32) * 5 / 9) * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + C + "C");

  } else if (args[1].endsWith("c")) {
    let c = toAmount(args[1]);
    let f = Math.round((c * 9 / 5) + 32);
    input.channel.send(args[1] + "in freedoms is: " + f + "F");

  } else if (args[1].endsWith("mph") || args[1].endsWith("miles")) {
    let mph = toAmount(args[1]);
    let kph = Math.round(mph * 1.609344 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kph + " km(per hour if speed)");

  } else if (args[1].endsWith("kph") || args[1].endsWith("kmph") || args[1].endsWith("km")) {
    let kph = toAmount(args[1]);
    let mph = Math.round(kph * 0.6213712 * 10) / 10;
    input.channel.send(args[1] + " in freedomUnits is: " + mph + " miles(per hour if speed)");

  } else if (args[1].endsWith("lbs") || args[1].endsWith("pounds")) {
    let lbs = toAmount(args[1]);
    let kg = Math.round(lbs * 0.4535924 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kg + "kg");

  } else if (args[1].endsWith("kg")) {
    let kg = toAmount(args[1]);
    let lbs = Math.round(kg * 2.204623 * 10) / 10;
    input.channel.send(args[1] + " in freedomUnits is: " + lbs + "lbs");

  } else if (args[1].endsWith("oz") || args[1].endsWith("ounce") || args[1].endsWith("ounces")) {
    let oz = toAmount(args[1]);
    let l = Math.round(oz * 0.0284131 * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + l + " liters");

  } else if (args[1].endsWith("l") || args[1].endsWith("liter") || args[1].endsWith("liters")) {
    let l = toAmount(args[1]);
    let oz = Math.round(l * 33.81413 * 10) / 10;
    input.channel.send(args[1] + " in freedomUnits is: " + oz + " oz");
  } else if (args[1].endsWith("usd") || args[1].endsWith("nok") || args[1].endsWith("cad") || args[1].endsWith("eur") || args[1].endsWith("nzd")) {
    await checkCurrencyList()
      .then( () => {
        currencyConvert(input, toCurrency(args[1]), toAmount(args[1]))
          .catch(e => {
            console.error(e);
          });
      })
      .catch(e => {
        console.error(e);
      });

  }
  else input.channel.send("try again. Syntax example: !freedom 10F");

};

const currencyConvert = async (input, currency, amount) => {



  fs.readFile("currency.json", (err, file) => {
    if (err) console.error(err);

    if (!file) {
      console.log("currency.json not found");
      return;
    }

    let obj = JSON.parse(file);

    let cur = ["NOK", "NZD", "EUR", "CAD"];

    if (currency[0] === "usd") {
      let str = amount + currency[0] + " is: ";
      cur.forEach((item, i) => {
        str += cur[i] + ": " + Math.round(amount * obj.rates[item] * 10) / 10 + ", ";
      });
      input.channel.send(str);
    } else {
      let str = amount + currency[0].toUpperCase() + " is: ";
      let usd = Math.round(amount / obj.rates[currency[0].toUpperCase()] * 10) / 10;
      str += "USD: " + usd + ", ";
      cur.forEach((item, i) => {
        if (item !== currency[0].toUpperCase()) str += cur[i] + ": " + Math.round(usd * obj.rates[item] * 10) / 10 + ", ";
      });

      input.channel.send(str);
    }
  });

};

const checkCurrencyList = async () => {

  fs.readFile("currency.json", (err, file) => {
    let d = new Date();
    let ut = Math.round(d.getTime()/1000 * 10) / 10;

    let obj = JSON.parse(file);
    if (obj.time_last_updated + 86400 < ut) {
      updateCurrencyList();
      console.log("større", obj.time_last_updated, ut);
    }
    else {
      console.log("mindre", obj.time_last_updated, ut);
    }
  });
};

const updateCurrencyList = async () => {
  fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(res => res.json())
    .then(j => {
      fs.writeFileSync("currency.json", JSON.stringify(j));
    });
};

//regex for strings
function toCurrency(str) {
  return str.match(/[a-z]+/g);
}

//regex for positive, negative numbers, and decimals
function toAmount(str) {
  return str.match(/^-?[0-9]+(\.[0-9])?/g);
}

module.exports.help = {
  name: "freedom"
};

