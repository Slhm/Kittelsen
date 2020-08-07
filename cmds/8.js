const ownerId = require('../auth.json').ownerId;
const dbHelper = require('../dbHelper');
const funcHelper = require('../funcHelper');

//8Ball

let eightBall = ["Without a doubt.", "Yes.", "Fuck yes.", "Most likely.", "Pretty sure, yeah.", "I think so?", "Ja for faen", "oui",
    "if my tasseography skills are on point, my tea cup says yes",
    "That question have remained unsolved for ages, but i believe I have figured out the answer. It is all based on the ancient scriptures of the Wizard Lord Yourofsky-chan. The answer is: fuck yeah, dude",
    "My calculations says no.", "No.", "Don't count on it.", "This rng thing here says no.", "what? idk", "Probably not", "Hell no", "NO GOD NO. PLEASE GOD. NOOOOOOOOO", "that's a no from me", ""];

//let eightBall = ["test", ""];

let doubleLoop = false;

module.exports.run = async (client, input, args, con, arguments) => {

    let ar = args;
    await ar.shift();
    let q = await ar.join(" ");

    if (q.includes(' or ')) orFunc(input, q);
    else {
	let flag = args[0];

	// Checks for Insert, List, Delete, and Help flags in the message.
        if (funcHelper.isOwner(input) && (flag === "-i" || flag === "--insert") && args[1] && arguments[0]) dbHelper.insertItems("eightball", ["type", "answer"], ["'" + args[1] + "'", "'" + arguments[0] + "'"], con, input);
        else if (funcHelper.isOwner(input) && (flag === "-l" || flag === "--list")) dbHelper.listLinksInTable("eightball", ["type", "answer"], con, input);
        else if (funcHelper.isOwner(input) && (flag === "rm" || flag === "--remove")) await dbHelper.deleteItem("eightball", 'id = ' + args[1], con, input);
        else if (funcHelper.isOwner(input) && (flag === "-h" || flag === "--help")) input.channel.send("**!8 -i TYPE_HERE \"TEXT_HERE\"** to insert new item \n**!8 -l** for list \n**!8 rm ID_HERE** to remove DB item");
        else {

            //let ra = Math.floor(Math.random());
            //if(ra > 0.5);
            let r = Math.floor(Math.random() * eightBall.length);

            //This is for the last element in the array. It's a loop that asks the bot again.
            if (r === eightBall.length - 1) {
                await input.channel.send("hmm, i dont know about that, but i know this one dude who might know. just a sec");
                await input.channel.send("!8 **hey, drunkBot. do you know: ** " + q);

                //It sets the var doubleLoop to true, so that it can know if it happens two times in a row.
                if (!doubleLoop) doubleLoop = true;

                //If doubleLoop is true, it means it has looped back once, and it has hit the last element again.
                //This fetches a variable in the database to display how many times it has happened, adds 1, and pings the owner.
                else {
                    // TODO: change this into dbHelper functions.
                    await con.query('SELECT num FROM eight WHERE id = 11', (e, rows) => {
                        if (e) throw e;
                        let tmp = parseInt(rows[0].num);
                        let newVal = tmp + 1;
                        con.query('UPDATE eight SET num = ' + newVal + ' WHERE id = 11');
                        //console.log(rows[0].num);
                        let chance = Math.pow(1 / eightBall.length, 2);
                        input.channel.send("<@!" + ownerId + ">, it happened. there's a " + chance + "% chance of this happening. it has happened: " + tmp + " times before.");
                    });
                    doubleLoop = false;
                }
            } else {
              let m  = "";
              await dbHelper.getRandomItem('eightball', con, input, 'answer')
                  .then(link => {
                    m = link;
                  });
              input.channel.send(m);
                doubleLoop = false;
            }
        }
    }
};

function orFunc(input, q) {

    let options = q.split(' or ');
    let opValue = options[Math.floor(Math.random() * options.length)];

    input.channel.send(opValue + " all the way, comrade");
}

module.exports.help = {
    name: "8"
};
