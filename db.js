const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function open() {
    return (await sqlite.open({
        filename: 'Thisvsthat.db',
        driver: sqlite3.Database
    }));
}

async function getAllDevices() {
    const db = await open();
    const result = db.all('select * from device');
    await db.close();

    return result;
}

async function getDeviceBrands(catagory) {
    const db = await open();
    const result = db.all(`select distinct manufacturer from device where category = "${catagory}"`);
    await db.close();

    return result;
}

async function registeringUsers(username, email, password) {
    console.log("Entered the DB");
    const db = await open();
    console.log(username);
    db.run(`INSERT INTO user (username, email, password) VALUES ("${username}","${email}","${password}")`);
    await db.close();
}

module.exports = {
    getAllDevices,
    registeringUsers,
    getDeviceBrands
}
