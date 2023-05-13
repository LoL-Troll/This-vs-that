const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function open() {
    return (await sqlite.open({
        filename: 'Thisvsthat.db',
        driver: sqlite3.Database
    }));
}

async function getAllDevices() {
    console.log(1);
    const db = await open();
    const result = await db.all('select * from device');
    await db.close();

    return result;
}

async function getUserById(id) {
    console.log(2);
    const db = await open();
    // sqlite is case sensitive (a != A), use COLLATE NOCASE to make it insensitive
    console.log(`select * from user where userId = ${id}`)
    const result = await db.get(`select * from user where userId = ${id}`);
    await db.close();

    return result;
}

async function getUser(email, password) {
    console.log(3);
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

async function getHistory(userID) {
    console.log(6);
    const db = await open();

    const result = db.all(`
    SELECT *, strftime('%d/%m/%Y', date, "localtime") as dateFormatted, strftime('%H:%M', date, "localtime") as timeFormatted
    FROM history, device
    WHERE deviceid = id and userID = ${userID} 
    order by date desc`);

    await db.close();
    return result;
}

async function updateHistory(userid, deviceid) {
    console.log(71);
    const db = await open();

    const result = await db.run(`
    insert into history (userID, deviceID, date) values (${userid}, ${deviceid}, CURRENT_TIMESTAMP)`);
    await db.close();

    return result;
}


async function getAllDevices(category, brands, sort) {
    console.log(123);
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
        console.log("HRHRHRHRHRHRHRHRHRH" +filterBrands);
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
async function getDeviceByBrand(brand, category) {
    const db = await open();
    const result = await db.all(`SELECT name,id from device where manufacturer = "${brand}" and category = "${category}"`);
    await db.close();
    return result;
}

async function getDeviceByID(id) {
    console.log(42213)
    const db = await open();

    console.log(`SELECT * FROM device NATURAL JOIN ${(await getDeviceType(id))[0]["category"]} WHERE id = ${id}`);
    const result = await db.all(`SELECT * FROM device NATURAL JOIN ${(await getDeviceType(id))[0]["category"]} WHERE id = ${id}`);
    await db.close();

    console.log("OOOOOOOOOOOOOOOOOOOOOO");
    console.log(result);
    console.log("OOOOOOOOOOOOOOOOOOOOOO");

    return result;
}

async function getDeviceType(id) {
    console.log(345235);
    const db = await open();
    const result = await db.all(`SELECT category FROM device WHERE id = ${id}`);
    await db.close();

    return result;
}

async function searchDevices(value) {
    console.log(423974);
    const db = await open();
    const result = await db.all(`SELECT * FROM device WHERE name LIKE '%${value}%' 
    OR manufacturer LIKE '%${value}%' OR model LIKE '%${value}%'`);
    await db.close();

    return result;
}

async function registeringUsers(name, username, email, password) {
    console.log(3432)
    const db = await open();
    await db.run(`INSERT INTO user (name, username, email, password, usertype) VALUES ("${name}","${username}","${email}","${password}", "user")`);
    await db.close();
}


async function postingReview(userid, deviceid, comment, rating) {
    console.log(3483298)
    console.log("Entered the DB");
    const db = await open();
    await db.run(`INSERT INTO review (userID, deviceID, comment, rating) VALUES ("${userid}","${deviceid}","${comment}", "${rating}")`)
    await db.close();
}

async function getAllReviews(deviceID) {
    console.log(3424);
    const db = await open();
    const result = db.all(`select * from review natural join user where deviceID = ${deviceID}`);
    await db.close();

    return result;
}

async function deleteReview(review_id) {
    const db = await open();
    const result = await db.run(`delete from review where reviewID = ${review_id}`)
    await db.close();
    return result;
}


async function addDevice(name, model, brand, image, product_category, jarir_link, noon_link) {
    const db = await open();

    await db.run(`INSERT INTO device (name, manufacturer, model, picture, category, jarir_link, noon_link) 
    VALUES ("${name}","${brand}","${model}", "${image}" ,"${product_category}", "${jarir_link}", "${noon_link}")`);

    await db.close();
}

async function getDeviceID(model, brand) {
    const db = await open();

    console.log(model, brand, "________");
    const result = await db.get(`select id from device where manufacturer = "${brand}" and model = "${model}"`);
    console.log(`select id from device where manufacturer = "${brand}" and model = "${model}"`, result);

    await db.close();
    return result.id;
}

async function addMouse(length, width, height, weight, sensor_type, dpi, max_acceleration, max_tracking_speed, polling_rate, connectivity, number_of_buttons, color, onboard_memory, led_lighting, adjustable_weight, id) {
    const db = await open();

    await db.run(`INSERT INTO mouse (id,length,width,height,weight,sensor_type,dpi,max_acceleration,max_tracking_speed,polling_rate,connectivity,
        number_of_buttons,color,onboard_memory,led_lighting,adjustable_weight) 
    VALUES ("${id}","${length}","${width}","${height}", "${weight}","${sensor_type}","${dpi}","${max_acceleration}","${max_tracking_speed}","${polling_rate}","${connectivity}",
    "${number_of_buttons}","${color}","${onboard_memory}","${led_lighting}","${adjustable_weight}")`);

    await db.close();
}

async function addMonitor(width,height,size,panel_type,refresh_rate,response_time,brightness,color,wide_screen,curve_screen,speakers,aspect_ratio_y,aspect_ratio_x,id){
    const db = await open();

    console.log(`INSERT INTO monitor (id,resolution_x,resolution_y,size,panel_type,refresh_rate,response_time,brightness,color,wide_screen,curve_screen,speakers,aspect_ratio_y,aspect_ratio_x) 
    VALUES ("${id}","${width}","${height}","${size}", "${panel_type}","${refresh_rate}","${response_time}","${brightness}","${color}","${wide_screen}","${curve_screen}",
    "${speakers}", "${aspect_ratio_y}", "${aspect_ratio_x}")`);

    await db.run(`INSERT INTO monitor (id,resolution_x,resolution_y,size,panel_type,refresh_rate,response_time,brightness,color,wide_screen,curve_screen,speakers,aspect_ratio_y,aspect_ratio_x) 
    VALUES ("${id}","${width}","${height}","${size}", "${panel_type}","${refresh_rate}","${response_time}","${brightness}","${color}","${wide_screen}","${curve_screen}",
    "${speakers}", "${aspect_ratio_y}", "${aspect_ratio_x}")`);

    await db.close();
}

async function addHeadset(type, max_frequency_response, microphone, wireless, encloser_type, color, active_noise_cancelling, channels, sensitivity, impedance, id) {
    const db = await open();

    await db.run(`INSERT INTO headset (id,type,max_frequency_response,microphone, wireless ,encloser_type,color, active_noise_cancelling, channels, sensitivity, impedance) 
    VALUES (${id},"${type}","${max_frequency_response}","${microphone}", "${wireless}","${encloser_type}","${color}","${active_noise_cancelling}","${channels}","${sensitivity}",
    "${impedance}")`);

    await db.close();
}

async function addPhone(phone_video, IP_rating, resolution_h, resolution_v, length, width, depth, screen_size, display_type, screen_to_body_ratio, weight, frequency, ppi, cpu, chipset, gpu, ram, battery, camera, phone_selfie_camera, sensors, charging_speed, os, headphone_jack, colors, id) {
    const db = await open();
    await db.run(
        `INSERT INTO phone (phone_video,IP_rating,resolution_h,resolution_v,length,width,depth,screen_size,display_type,screen_to_body_ratio,weight,frequency,pixel_density,cpu,chipset,gpu,memory,battery,camera,phone_selfie_camera,sensors,charging_speed,os,headphone_jack,colors,id) 
        VALUES ("${phone_video}","${IP_rating}","${resolution_h}","${resolution_v}","${length}","${width}","${depth}","${screen_size}","${display_type}",
        "${screen_to_body_ratio}","${weight}","${frequency}","${ppi}","${cpu}","${chipset}","${gpu}","${ram}","${battery}","${camera}",
        "${phone_selfie_camera}","${sensors}","${charging_speed}","${os}","${headphone_jack}","${colors}","${id}")`
    );
    await db.close();
}

async function addKeyboard(style, switch_type, backlit, tenkeyless, connection_type, color, id) {
    const db = await open();
    await db.run(`INSERT INTO keyboard (style,switch_type,backlit,tenkeyless,connection_type,color,id) 
    VALUES ("${style}","${switch_type}","${backlit}","${tenkeyless}","${connection_type}","${color}",${id})`);
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
    getUserById,
    updateHistory,
    getHistory,
    getDeviceByBrand,
    deleteReview,
    addDevice,
    getDeviceID,
    addMonitor,
    addMouse,
    addHeadset,
    addPhone,
    addKeyboard
}



