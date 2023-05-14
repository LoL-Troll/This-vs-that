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

async function getHistory(userID) {
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
    const db = await open();

    const result = await db.run(`
    insert into history (userID, deviceID, date) values (${userid}, ${deviceid}, CURRENT_TIMESTAMP)`);
    await db.close();

    return result;
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
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (category = "mouse" and manufacturer in (${brands.mouse_brand})) `;
    } ``

    // if there are filters for keyboard brands
    if (brands.keyboard_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (category = "keyboard" and manufacturer in (${brands.keyboard_brand}))`;
    }

    // if there are filters for monitor brands
    if (brands.monitor_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (category = "monitor" and manufacturer in (${brands.monitor_brand}))`;
    }

    // if there are filters for headset brands
    if (brands.headset_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (category = "headset" and manufacturer in (${brands.headset_brand}))`;
    }

    // if there are filters for phone brands
    if (brands.phone_brand != undefined) {
        filterBrands = (filterBrands === "TRUE" ? `` : (filterBrands + ` or `)) + ` (category = "phone" and manufacturer in (${brands.phone_brand}))`;
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
    const db = await open();

    const result = await db.all(`SELECT * FROM device NATURAL JOIN ${(await getDeviceType(id))[0]["category"]} WHERE id = ${id}`);
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
    const db = await open();
    await db.run(`INSERT INTO review (userID, deviceID, comment, rating) VALUES ("${userid}","${deviceid}","${comment}", "${rating}")`)
    await db.close();
}

async function getAllReviews(deviceID) {
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

    const result = await db.get(`select id from device where manufacturer = "${brand}" and model = "${model}"`);

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

async function updateDevice(id,name, model, brand, image, product_category, jarir_link, noon_link){
    const db = await open();

    await db.run(`UPDATE device set name = "${name}",  manufacturer = "${brand}" , model = "${model}", picture = "${image}", category = "${product_category}", jarir_link = "${jarir_link}", noon_link = "${noon_link}" WHERE id = "${id}"`);

    await db.close();
}


async function updateMouse(length, width, height, weight, sensor_type, dpi, max_acceleration, max_tracking_speed, polling_rate, connectivity, number_of_buttons, color, onboard_memory, led_lighting, adjustable_weight, id) {
    const db = await open();

    await db.run(`UPDATE mouse SET length = "${length}",width = "${width}" ,height = "${height}",weight = "${weight}" ,sensor_type = "${sensor_type}"
    ,dpi = "${dpi}" ,max_acceleration = "${max_acceleration}" ,max_tracking_speed = "${max_tracking_speed}",polling_rate = "${polling_rate}",
    connectivity = "${connectivity}",number_of_buttons = "${number_of_buttons}",color = "${color}",onboard_memory = "${onboard_memory}",led_lighting = "${led_lighting}", adjustable_weight = "${adjustable_weight}"
    WHERE id = "${id}"`);

    await db.close();
}


async function updateMonitor(width,height,size,panel_type,refresh_rate,response_time,brightness,color,wide_screen,curve_screen,speakers,aspect_ratio_y,aspect_ratio_x,id){
    const db = await open();

    await db.run(`UPDATE monitor SET resolution_x = "${width}",resolution_y = "${height}",size = "${size}",panel_type = "${panel_type}"
    ,refresh_rate = "${refresh_rate}",response_time = "${response_time}",brightness = "${brightness}",color = "${color}",wide_screen = "${wide_screen}"
    ,curve_screen = "${curve_screen}",speakers = "${speakers}",aspect_ratio_y = "${aspect_ratio_y}",aspect_ratio_x = "${aspect_ratio_x}" WHERE id = "${id}"`);

    await db.close();
}


async function updateHeadset(type, max_frequency_response, microphone, wireless, encloser_type, color, active_noise_cancelling, channels, sensitivity, impedance, id) {
    const db = await open();

    await db.run(`UPDATE headset SET type = "${type}" ,max_frequency_response = "${max_frequency_response}" ,microphone = "${microphone}",
    wireless = "${wireless}" ,encloser_type = "${encloser_type}",color = "${color}", active_noise_cancelling = "${active_noise_cancelling}", channels = "${channels}"
    ,sensitivity = "${sensitivity}", impedance = "${impedance}" WHERE id = "${id}"`);

    await db.close();
}

async function updatePhone(phone_video, IP_rating, resolution_h, resolution_v, length, width, depth, screen_size, display_type, screen_to_body_ratio, weight, frequency, ppi, cpu, chipset, gpu, ram, battery, camera, phone_selfie_camera, sensors, charging_speed, os, headphone_jack, colors, id) {
    const db = await open();
    await db.run(
        `UPDATE phone SET phone_video = "${phone_video}",IP_rating = "${IP_rating}",resolution_h = "${resolution_h}",resolution_v = "${resolution_v}"
        ,length = "${length}",width = "${width}",depth = "${depth}",screen_size = "${screen_size}",display_type = "${display_type}" 
        ,screen_to_body_ratio = "${screen_to_body_ratio}",weight = "${weight}",frequency = "${frequency}",pixel_density = "${ppi}"
        ,cpu = "${cpu}",chipset = "${chipset}" ,gpu = "${gpu}" ,memory = "${ram}",battery = "${battery}" ,camera = "${camera}"
        ,phone_selfie_camera = "${phone_selfie_camera}",sensors = "${sensors}",charging_speed = "${charging_speed}",os = "${os}"
        ,headphone_jack = "${headphone_jack}",colors = "${colors}" WHERE id = "${id}"`);


        console.log("entered phone")
    await db.close();
}

async function updateKeyboard(style, switch_type, backlit, tenkeyless, connection_type, color, id) {
    const db = await open();
    await db.run(`UPDATE keyboard SET style = "${style}",switch_type = "${switch_type}",backlit = "${backlit}",tenkeyless = "${tenkeyless}"
    ,connection_type = "${connection_type}",color = "${color}" WHERE id= "${id}"`);
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
    addKeyboard,
    updateDevice,
    updateMouse,
    updateHeadset,
    updateMonitor,
    updatePhone,
    updateKeyboard
}



