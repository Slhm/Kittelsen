const botjs = require('./bot');
const funcHelper = require('./funcHelper');

//regex for strings
module.exports.toLetters = async (str) => {
    return str.match(/[a-z]+/g);
};

//regex for positive, negative numbers, and decimals
module.exports.toNumber = async (str) => {
    return str.match(/^-?[0-9]+(\.[0-9])?/g);
};

//tableName = name of table in database, f = array of fields(in order you want them presented i.e f[0]: f[1])
module.exports.listLinksInTable = async (tableName, f, con, input) => {
    getAllItems(tableName, con)
        .then(rows => {
            let list = "";
            rows.forEach((row, i) => {
                if(f[1]) list += i + 1 + ": " + "<" + row[f[0].toString()] + "> " + f[1] + ": " + row[f[1].toString()] + "\n";
		else list += i + 1 + ": " + "<" + row[f[0].toString()] + ">\n";
            });
            input.channel.send("items in table: \n" + list);
        })
};

module.exports.insertItems = async (tableName, columnNames, vals, con, input) => {
    insertItems(tableName, columnNames, vals, con)
        .then(rows => {
            if (rows) input.channel.send("item added successfully");
            else input.channel.send("failed to add item");
        })
        .catch(e => console.log(e))
};

module.exports.incrementAmount = async (tableName, userId, con) => {
    let tmpVal;
    await getOneUserItem(tableName, userId, con)
        .then(user => {
            if (!user) {
                insertItems(tableName, ['userId', 'amount'], [userId, 1], con);
            } else {
                tmpVal = parseInt(user.amount) + 1;
                updateItem(tableName, ['amount', 'userId'], tmpVal, userId, con);
            }
        });
    return tmpVal ? tmpVal : 1;
};

module.exports.insertUserIdAndOneItem = async (tableName, columnName, userId, val, con, input) => {
    insertItems(tableName, ['userId', columnName], ['\'' + userId + '\'', '\'' + val + '\''], con)
        .then(rows => {
            if (rows) input.channel.send("item added successfully");
            else input.channel.send("failed to add item");
        })
        .catch(e => console.log(e))
};

module.exports.getOneItem = async (tableName, columnName, id, con, itemName) => {
    let tmpVal = 0;
    await getOneItemFromId(tableName, id, con)
        .then(item => {
            if (!item) {
                console.log("no item in getOneItem");
                return false;
            } else {
                tmpVal = item[itemName];
            }
        });
    return tmpVal;
};

module.exports.listHighScore = async (tableName, typeOfAmount, con, input) => {
    let lb = "";
    let members = input.guild.members;
    let i = 1;

    await con.query('SELECT * FROM ' + tableName + ' ORDER BY amount DESC', (e, rows) => {

        rows.forEach((row) => {
            members.forEach((member) => {
                if (row.userId === member.user.id.toString() && i <= 20) {
                    lb += "[" + i + "]   " + "#" + member.user.username + ":\n" +
                        "          Amount of " + typeOfAmount + ": " + row.amount + "\n";
                    i++;
                }
            })
        });
        input.channel.send("**" + typeOfAmount + " Leader Board:** \n" + "```css\n" + lb + "\n```");
    })
};

module.exports.getRandomItem = async (tableName, con, input, columnName) => {
    let m = 0;
    let r = await getCount(tableName, con)
        .then(count => {
            return (Math.floor(Math.random() * count) + 1);
        });
    await getOneItemFromId(tableName, r, con)
        .then(msg => {
            if (!msg) return false;
            else m = msg[columnName];
            return m;
        });
    return m;
};

module.exports.getUsernameFromId = async (userId) => {

};

module.exports.updateItem = async (tableName, columnNames, newVal, _id, con) => {
    updateItem(tableName, columnNames, newVal, _id, con)
        .then((e) => {
            return e;
        });
};

module.exports.getAllUserIdsInTable = async (tableName, con) => {

    let tmpArray = [];
    await getAllItems(tableName, con)
        .then(rows => {
            rows.forEach((row, i) => {
                tmpArray.push(row.userId);
            });
            return tmpArray;
        })
        .then(tmpArray => {
            return (tmpArray);
        })
        .catch(e => {
            console.log("getAllUserIdsInTable Error: " + e)
        });
    return tmpArray;
};


//dbHelper.deleteItem('cozy','id = ' + args[2], con, input);
module.exports.deleteItem = async (tableName, query, con, input) => {
    await deleteItem(tableName, query, con, true)
        .then(re => {
            if (re) input.channel.send("item removed");
        })
        .catch(e => input.channel.send("error deleting item"));
};


module.exports.deleteUserItem = async (tableName, query, con, input) => {
    await deleteItem(tableName, query, con, false)
        .then(re => {
            if (re) input.channel.send("item removed");
        })
        .catch(e => input.channel.send("error deleting item"));
};

function deleteItem(tableName, query, con, autoInc) {
    return new Promise((resolve, reject) => {
        con.query('DELETE FROM ' + tableName + ' WHERE ' + query, (e, rows) => {
            if (e) {
                funcHelper.logError('deleteItem error: ' + e);
                reject(e);
            } else {
                if (autoInc) {
                    con.query('SET @count = 0;');
                    con.query('UPDATE ' + tableName + ' SET ' + tableName + '.id ' + ' = @count := @count + 1;');
                    con.query('ALTER TABLE ' + tableName + ' AUTO_INCREMENT = 1');
                }
                resolve(1);
            }
        })
    })
}

function getOneUserItem(tableName, userId, con) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM ' + tableName + ' WHERE userId = ' + userId, (e, row) => {
            if (e) {
                funcHelper.logError('getOneUserItem error: ' + e);
                reject(e);
            } else resolve(row[0]);
        });
    })
}

function getOneItem(tableName, id, con) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM ' + tableName + ' WHERE id = ' + id, (e, rows) => {
            if (e) {
                funcHelper.logError('getOneItem error: ' + e);
                reject(e);
            } else resolve(rows[0]);
        })
    })
}


//columnNames[0] = amountColumnName, columnName[1] = idName;
function insertItems(tableName, columnNames, vals, con) {
    console.log("Inne i insert:\ncolumnsNames: " + columnNames + "\nvals: " + vals);
    return new Promise((resolve, reject) => {
        con.query('INSERT INTO ' + tableName + ' (' + columnNames + ') VALUES (' + vals + ')', (e, rows) => {
            if (e) {
                console.log("it didnt work");
                funcHelper.logError('insertItems error: ' + e);
                reject(false);
            } else {
                console.log("it worked");
                resolve(true);
            }
        })
    });
}

//columnNames[0] = amountColumnName, columnName[1] = idName;
function updateItem(tableName, columnNames, newVal, _id, con) {
    console.log("Inne i update:\ncolumnsNames: " + columnNames + "\nnewVal: " + newVal + "\n_id: " + _id);
    return new Promise((resolve, reject) => {
        con.query('UPDATE ' + tableName + ' SET ' + columnNames[0] + ' = ' + newVal + ' WHERE ' + columnNames[1] + ' = ' + _id, (e, rows) => {
            if (e) {
                funcHelper.logError('updateItem error: ' + e);
                reject(false);
            } else resolve(true);
        })
    });
}

function getCount(tableName, con) {
    return new Promise((resolve, reject) => {
        con.query('SELECT COUNT(*) AS count FROM ' + tableName, (e, rows) => {
            if (e) {
                funcHelper.logError('getCount error: ' + e);
                reject(e);
            } else resolve(rows[0].count);
        });
    })
}


function getOneItemFromId(tableName, itemId, con) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM ' + tableName + ' WHERE id = ' + itemId, (e, row) => {
            if (e) {
                funcHelper.logError('getOneItemFromId error: ' + e);
                reject(e);
            } else resolve(row[0]);
        });
    })
}

function getAllItems(tableName, con) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM ' + tableName, (e, rows) => {
            if (e) {
                funcHelper.logError('getAllItems error: ' + e);
                reject(e);
            } else resolve(rows);
        })
    })
}

