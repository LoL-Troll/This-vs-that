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


async function getBrands(category) {
    const db = await open();
    const result = db.get(`select manufacturer from device where category = ${category}`);
    await db.close();

    return result;
}

module.exports = {
    getAllDevices
    ,getBrands
}
