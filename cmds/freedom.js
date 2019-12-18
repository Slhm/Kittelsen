const fetch = require('node-fetch');
const fs = require('fs');

module.exports.run = async (client, input, args) => {
  console.log("freedom my dude");
  //if (args[2]) args[1] = args[1] + args[2];
  args[1] = args[1].toLowerCase();
  args[2] = args[2] ? args[2].toLowerCase() : "";
  args[1] = args[1].replace(/\s*$/,"");

  if (!args[1]) {
    input.channel.send("Freedom units to metric converter and vice versa.\n" +
      "These convertions are available so far:\n" +
      "m(ph) - k(ph)\n" +
      "F - C\n" +
      "lbs - kg\n" +
        "currencies(uds,eur,nok,cad,nzd)" +
      "syntax example !c 10F");

  } else if (checkUnit(args, ["f", "fahrenheit"])) {
    let F = toAmount(args[1]);
    let C = Math.round(((F - 32) / 1.8) * 10) / 10;
    input.channel.send(args[1] + " in non-freedomUnits is: " + C + "C");

  } else if (checkUnit(args, ["c", "celsius"])) {
    let c = toAmount(args[1]);
    let f = Math.round((c * 1.8) + 32);
    
    input.channel.send(args[1] + " in freedoms is: " + f + "F");

  } else if (checkUnit(args, ["mph", "miles"])) {
    let mph = toAmount(args[1]);
    let kph = Math.round(mph * 1.609344 * 100) / 100;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kph + " km(per hour if speed)");

  } else if (checkUnit(args, ["kph", "kmph", "km"])) {
    let kph = toAmount(args[1]);
    let mph = Math.round(kph * 0.6213712 * 100) / 100;
    input.channel.send(args[1] + " in freedomUnits is: " + mph + " miles(per hour if speed)");

  } else if (checkUnit(args, ["lbs", "pounds", "pound"])) {
    let lbs = toAmount(args[1]);
    let kg = Math.round(lbs * 0.4535924 * 100) / 100;
    input.channel.send(args[1] + " in non-freedomUnits is: " + kg + "kg");

  } else if (checkUnit(args, ["kg", "kilogram"])) {
    let kg = toAmount(args[1]);
    let lbs = Math.round(kg * 2.204623 * 100) / 100;
    input.channel.send(args[1] + " in freedomUnits is: " + lbs + "lbs");

  } else if (checkUnit(args, ["oz", "ounce", "ounces"])) {
    let oz = toAmount(args[1]);
    let l = Math.round(oz * 0.0284131 * 100) / 100;
    input.channel.send(args[1] + " in non-freedomUnits is: " + l + " liters");

  } else if (checkUnit(args, ["l", "liter", "liters"])) {
    let l = toAmount(args[1]);
    let oz = Math.round(l * 33.81413 * 100) / 100;
    input.channel.send(args[1] + " in freedomUnits is: " + oz + " oz");
  
  }else if (checkUnit(args, ["cm"])) {
    let m = toAmount(args[1]);
    let feet = Math.round(m * 0.03280840 * 100) / 100;
    input.channel.send(args[1] + " in freedomUnits is: " + feet + " feet");
  
  }else if (checkUnit(args, ["m", "meter", "meters"])) {
    let m = toAmount(args[1]);
    let feet = Math.round(m * 3.280840 * 100) / 100;
    input.channel.send(args[1] + " in freedomUnits is: " + feet + " feet");

    //feet to meters
  } else if (checkUnit(args, ["ft", "feet"])) {
    let feet = toAmount(args[1]);
    let m = Math.round(feet * 0.3048 * 100) / 100;
    input.channel.send(args[1] + " in freedomUnits is: " + m + " meters");
  } else if (checkUnit(args, ["usd", "nok", "cad", "eur", "nzd"])) {
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
  else input.channel.send("Either wrong syntax or the unit isnt implemented yet. Syntax example: !freedom 10F\nSupported units so far: F/C, miles/km, m/ft, l/oz, lbs/kg, currencies(USD,NOK,EUR,CAD,NZD)");
};

function checkUnit(args, unit){
	let check = false;
	unit.forEach(u => {
		if(args[1].endsWith(u) || args[2].endsWith(u)) check = true;
	})
	return check;
	//return args[1].endsWith(unit) || args[2].endsWith(unit);
}

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

//if local currency json file is older than 24h it updates.
const checkCurrencyList = async () => {

  fs.readFile("currency.json", (err, file) => {
    let d = new Date();
    let ut = Math.round(d.getTime()/1000 * 10) / 10;

    let obj = JSON.parse(file);
    if (obj.time_last_updated + 86400 < ut) {
      updateCurrencyList();
      //console.log("større", obj.time_last_updated, ut);
    }
    else {
      //console.log("mindre", obj.time_last_updated, ut);
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
    return str.match(/^-?\d*\.?\d*/g);
    //return str.match(/^-?[0-9]+(\.[0-9])?/g);
}

module.exports.help = {
  name: "freedom"
};

