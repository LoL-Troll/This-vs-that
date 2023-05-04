
const db = require('aa-sqlite');
db.open('Thisvsthat.db');

async function getAllDevices(){
    const result = await db.get("select * from device");
    return result;
}

const x = getAllDevices();


