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
    const result = await db.all('select * from device');
    await db.close();

    return result;
}

async function getUserById(id) {
    const db = await open();
    // sqlite is case sensitive (a != A), use COLLATE NOCASE to make it insensitive
    console.log(`select * from user where userId = ${id}`)
    const result = await db.get(`select * from user where userId = ${id}`);
    await db.close();

    return result;
}

async function getUser(email, password) {
    const db = await open();
    // sqlite is case sensitive (a != A), use COLLATE NOCASE to make it insensitive
    const result = await db.get(`select * from user where email = "${email}" COLLATE NOCASE and password = "${password}"`);
    await db.close();

    return result;
}

async function updateUser(id, user) {
    const db = await open();

    const result = await db.run(`
    update user set 
    name = "${user.name}",   
    username = "${user.username}", 
    password = "${user.password}",
    picture = "${user.picture}"
    where userid = ${id};
    `);
    await db.close();

    return result;
}

async function updatePassword(id, oldPass, newPass) {
    const db = await open();

    const result = await db.run(`
    update user set 
    password = "${newPass}"   
    where userid = ${id} AND password = "${oldPass}";
    `);
    await db.close();

    return result;
}

async function updateHistory(userid, deviceid) {
    const db = await open();

    const result = await db.run(`
    insert into history (userID, deviceID) values (${userid}, ${deviceid});`);
    await db.close();

    return result;
}


async function getJarirPrice(jarir_link) {
    console.log(jarir_link);
    var len = jarir_link.length;

    if(len > 0){
        jarir_link= jarir_link.slice(len-11, len-5);
        console.log(jarir_link);
        jarir_link = "https://www.jarir.com/api/catalogv1/product/store/sa-en/sku/" + jarir_link;
        console.log(jarir_link);
        var price;
        try {
            const response = await fetch(jarir_link);
            const data = await response.json();
            
            price = data.hits.hits[0]._source.final_price;
        } catch (error) {
            console.error(error);
        }
        return price;
    }
    return "Not Avaliable"
}

async function getNoonPrice(noon_link) {
    var len = noon_link.length

    if(len > 0){
        noon_link= noon_link.slice(29);
        console.log(noon_link);
        noon_link = "https://www.noon.com/_svc/catalog/api/v3/u/" + noon_link;
        console.log(noon_link);
        var price;
        try {
            const response = await fetch(noon_link);
            const data = await response.json();
            
            price = data.product.variants[0].offers[0].sale_price;
        } catch (error) {
            console.error(error);
        }
        return price;
    }
    return "Not Avaliable"

}

async function getAllDevices(category, brands, sort) {
    filterCategory = "TRUE";
    filterBrands = "TRUE";

    // if there are filters for catagory
    if (category) {
        filterCategory = `category in (${category})`;
    }

    // if there are filters for mouses
    if (brands.mouse_brand != undefined) {
        // if there was no filters on brands, then create new filter, otherwise append another filter using or
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (manufacturer in (${brands.mouse_brand})) `;
    } ``

    // if there are filters for keyboard brands
    if (brands.keyboard_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (manufacturer in (${brands.keyboard_brand}))`;
    }

    // if there are filters for monitor brands
    if (brands.monitor_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (manufacturer in (${brands.monitor_brand}))`;
    }

    // if there are filters for headset brands
    if (brands.headset_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (manufacturer in (${brands.headset_brand}))`;
    }

    // if there are filters for phone brands
    if (brands.phone_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (manufacturer in (${brands.phone_brand}))`;
    }

    let sortBy = "";
    if (sort === "AZname") {
        sortBy = "order by name asc";
    } else if (sort === "ZAname") {
        sortBy = "order by name desc";
    } if (sort === "AZmodel") {
        sortBy = "order by model asc";
    } else if (sort === "ZAmodel") {
        sortBy = "order by model desc";
    } else if (sort === "type") {
        sortBy = "order by category asc";
    }


    const db = await open();
    const result = await db.all(`select * from device where ${filterCategory} and (${filterBrands}) ${sortBy}`);
    await db.close();

    return result;
}

async function getDeviceBrands(category) {
    const db = await open();
    const result = await db.all(`select distinct manufacturer from device where category = "${category}"`);
    await db.close();

    return result;
}

async function getDeviceByID(id) {
    const db = await open();

    console.log(`SELECT * FROM device NATURAL JOIN ${(await getDeviceType(id))[0]["category"]} WHERE id = ${id}`);
    const result = await db.all(`SELECT * FROM device NATURAL JOIN ${(await getDeviceType(id))[0]["category"]} WHERE id = ${id}`);
    console.log(result);
    await db.close();

    return result;
}

async function getDeviceType(id) {
    const db = await open();
    const result = await db.all(`SELECT category FROM device WHERE id = ${id}`);
    await db.close();

    return result;
}

async function searchDevices(value) {
    const db = await open();
    const result = await db.all(`SELECT * FROM device WHERE name LIKE '%${value}%' 
    OR manufacturer LIKE '%${value}%' OR model LIKE '%${value}%'`);
    await db.close();

    return result;
}

async function registeringUsers(name, username, email, password) {
    const db = await open();
    await db.run(`INSERT INTO user (name, username, email, password, usertype) VALUES ("${name}","${username}","${email}","${password}", "user")`);
    await db.close();
}


async function postingReview(userid, deviceid, comment, rating) {
    console.log("Entered the DB");
    const db = await open();
    await db.run(`INSERT INTO review (userID, deviceID, comment, rating) VALUES ("${userid}","${deviceid}","${comment}", "${rating}")`)
    await db.close();
}

async function getAllReviews() {
    const db = await open();
    const result = db.all('select * from review natural join user');
    await db.close();

    return result;
}

async function getHistory(userID){
    const db = await open();

    const result = db.all(`select * from history, device WHERE userID  = ${userID} AND id = deviceID`);

    await db.close();
    return result;
}

async function addDevice(model, brand, image, product_category) {
    const db = await open();

    db.run(`INSERT INTO device (name, manufacturer, model, picture, category) 
    VALUES ("x","${brand}","${model}", "${product_category}")`);

    await db.close();
}

async function addMonitor(screen_size, horizontal, vertical, refresh_rate, response_time, panel, brightness) {
    const db = await open();

    db.run(`INSERT INTO monitor (size, resolution_x, resolution_x, refresh_rate, response_time, panel_type, brightness, aspect_ratio_x, aspect_ratio_y, wide_screen, curve_screen, speakers, color) 
    VALUES ("${screen_size}","${horizontal}","${vertical}", "${refresh_rate}","${response_time}","${panel}","${brightness}"
    "1","1","yes","yes","yes","black")`);

    await db.close();
}

module.exports = {
    getAllDevices,
    registeringUsers,
    getDeviceBrands,
    getDeviceByID,
    getDeviceBrands,
    getUser,
    searchDevices,
    updateUser,
    updatePassword,
    postingReview,
    getAllReviews,
    addDevice,
    addMonitor,
    getUserById,
    updateHistory,
    getHistory,
    getJarirPrice,
    getNoonPrice,
}



