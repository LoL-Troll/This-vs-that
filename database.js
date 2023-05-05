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

async function getDeviceByID(id){
    const db = await open();

    const result = db.all(`SELECT * FROM device NATURAL JOIN ${(await getDeviceType(id))[0]["category"]} WHERE id = ${id}`);
    await db.close();

    return result;
}

async function getDeviceType(id){
    const db = await open();
    const result = db.all(`SELECT category FROM device WHERE id = ${id}`);
    await db.close();

    return result;
}

module.exports = {
    getAllDevices,
    getDeviceType,
    getDeviceByID
}

