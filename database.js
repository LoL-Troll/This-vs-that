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

async function getDeviceByKey(key){
    const db = await open();
    const result = db.all('SELECT * FROM device NATURAL JOIN  ')
}

async function getDeviceType(key){
    const db = await open();
    const result = db.all('SELECT type FROM device NATURAL JOIN ')
}

module.exports = {
    getAllDevices
}