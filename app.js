const express = require("express");
const nunjucks = require("nunjucks");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const db = require("./db.js");
const dataParser = require("./dataParser.js");

const app = express();
const port = 8001;

app.use("/styles", express.static('styles'));
app.use("/assets", express.static('assets'));
app.use("/scripts", express.static('scripts'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pageData = { signedIn: false, isAdmin: undefined, userData: undefined };


// Middlewares
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
}));

app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

app.use(bodyParser.urlencoded({ extended: true }));

// session cookie handler
app.use(async (req, res, next) => {
    // if there is a cookie, and user is signed in
    if (req.session && req.session.userId) {
        const user = await db.getUserById(req.session.userId);

        req.user = user;
    }
    next();
});


nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.listen(port, (e) => {
    console.log("listing on port " + port);
});

// Handlers 
app.get("/", async (req, res) => {

    // if user is signed in show history
    if (req.user) {
        let devicesHistory = await db.getHistory(req.user.userid);
        res.render('index.html', { user: req.user, devicesHistory: devicesHistory });
    } else {
        res.render('index.html', { user: req.user });
    }
});

app.delete('/item/:id', async (req, res) => {
    const review_id = req.params.id;
    const review_data = await db.deleteReview(review_id);

    res.send(review_data)
});


app.get("/about.html", (req, res) => {
    res.render('about.html', { user: req.user });
});

app.get("/add-product.html", (req, res) => {
    // admin only 
    // if session.isadmin
    if (req.user && req.user.usertype === "admin") {
        res.render('add-product.html', { user: req.user, category: req.query.category });
    } else {
        res.redirect("/");
    }
    // else 404
});

app.post("/postingProduct", async (req, res) => {

    //General Information
    var category = req.body.category.toLowerCase();

    var brand = req.body.brand;
    var model = req.body.Model;
    var name = brand + " " + model;
    var jarir_link = req.body.jarir_link;
    var noon_link = req.body.noon_link;

    // image upload
    if (req.files) {
        const img = req.files.image;
        image_path = "./assets/devices_pics/" + (name).replace(" ", "_") + ".jpg"
        img.mv(image_path);

        image = image_path;
    } else {
        image = "./assets/placeholder.jpg"
    }

    if (category === "monitor") {
        var width = req.body.resolution_x;
        var height = req.body.resolution_y;
        var size = req.body.size;
        var panel_type = req.body.panel_type;
        var refresh_rate = req.body.refresh_rate;
        var response_time = req.body.response_time;
        var brightness = req.body.brightness;
        var aspect_ratio_x = req.body.aspect_ratio_x;
        var aspect_ratio_y = req.body.aspect_ratio_y;
        var color = req.body.color;
        var wide_screen = req.body.wide_screen;
        var curve_screen = req.body.curve_screen;
        var speakers = req.body.speakers;
        await db.addDevice(name, model, brand, image, category, jarir_link, noon_link);
        var id = await db.getDeviceID(model, brand);
        await db.addMonitor(width, height, size, panel_type, refresh_rate, response_time, brightness, color, wide_screen, curve_screen, speakers, aspect_ratio_y, aspect_ratio_x, id);
        res.redirect("/add-product.html");
    }

    else if (category === "phone") {
        var length = req.body.length;
        var width = req.body.width;
        var depth = req.body.depth;
        var screen_size = req.body.screen_size;
        var IP_rating = req.body.IP_rating;
        var display_type = req.body.display_type;
        var screen_to_body_ratio = req.body.screen_to_body_ratio;
        var weight = req.body.weight;
        var frequency = req.body.frequency;
        var resolution_x = req.body.resolution_h;
        var resolution_y = req.body.resolution_v;
        var ppi = req.body.pixel_density;
        var cpu = req.body.cpu;
        var chipset = req.body.chipset;
        var gpu = req.body.gpu;
        var memory = req.body.memory;
        var camera = req.body.camera;
        var phone_video = req.body.phone_video;
        var phone_selfie_camera = req.body.phone_selfie_camera;
        var battery = req.body.battery;
        var sensors = req.body.sensors;
        var charging_speed = req.body.charging_speed;
        var os = req.body.os;
        var headphone_jack = req.body.headphone_jack;
        var colors = req.body.colors;

        await db.addDevice(name, model, brand, image, category, jarir_link, noon_link);
        var id = await db.getDeviceID(model, brand);

        await db.addPhone(phone_video, IP_rating, resolution_x, resolution_y, length, width, depth, screen_size, display_type, screen_to_body_ratio, weight, frequency, ppi, cpu, chipset, gpu, memory, battery, camera, phone_selfie_camera, sensors, charging_speed, os, headphone_jack, colors, id);
        res.redirect("/add-product.html");
    }

    else if (category === "mouse") {
        var length = req.body.length;
        var width = req.body.width;
        var height = req.body.height;
        var weight = req.body.weight;
        var sensor_type = req.body.sensor_type;
        var dpi = req.body.dpi;
        var max_acceleration = req.body.max_acceleration;
        var max_tracking_speed = req.body.max_tracking_speed;
        var polling_rate = req.body.polling_rate;
        var connectivity = req.body.connectivity;
        var number_of_buttons = req.body.number_of_buttons;
        var color = req.body.color;
        var onboard_memory = req.body.onboard_memory;
        var led_lighting = req.body.led_lighting;
        var adjustable_weight = req.body.adjustable_weight;

        await db.addDevice(name, model, brand, image, category, jarir_link, noon_link);
        var id = await db.getDeviceID(model, brand);
        await db.addMouse(length, width, height, weight, sensor_type, dpi, max_acceleration, max_tracking_speed, polling_rate, connectivity, number_of_buttons, color, onboard_memory, led_lighting, adjustable_weight, id);
        res.redirect("/add-product.html");
    }

    else if (category === "keyboard") {
        var style = req.body.style;
        var switch_type = req.body.switch_type;
        var backlit = req.body.backlit;
        var tenkeyless = req.body.tenkeyless;
        var connection_type = req.body.connection_type;
        var color = req.body.color;

        await db.addDevice(name, model, brand, image, category, jarir_link, noon_link);
        var id = await db.getDeviceID(model, brand);
        await db.addKeyboard(style, switch_type, backlit, tenkeyless, connection_type, color, id);
        res.redirect("/add-product.html");
    }

    else {
        var type = req.body.type;
        var max_frequency_response = req.body.max_frequency_response;
        var microphone = req.body.microphone;
        var wireless = req.body.wireless;
        var encloser_type = req.body.encloser_type;
        var color = req.body.color;
        var active_noise_cancelling = req.body.active_noise_cancelling;
        var channels = req.body.channels;
        var sensitivity = req.body.sensitivity;
        var impedance = req.body.impedance;

        await db.addDevice(name, model, brand, image, category, jarir_link, noon_link);
        var id = await db.getDeviceID(model, brand);
        await db.addHeadset(type, max_frequency_response, microphone, wireless, encloser_type, color, active_noise_cancelling, channels, sensitivity, impedance, id);
        res.redirect("/add-product.html");
    }

});


app.get("/browse.html", async (req, res) => {
    let sort = req.query.sort;
    let type = req.query.Type;

    let mouse_brand = req.query.mouse_brand;
    let keyboard_brand = req.query.keyboard_brand;
    let monitor_brand = req.query.monitor_brand;
    let headset_brand = req.query.headset_brand;
    let phone_brand = req.query.phone_brand;

    let devices;
    if (req.query.search) {  // if there is search just apply it without filter
        devices = await db.searchDevices(req.query.search);
    } else { // if there is not search just apply filter
        devices = await db.getAllDevices
            (type, {
                mouse_brand: mouse_brand,
                keyboard_brand: keyboard_brand,
                monitor_brand: monitor_brand,
                headset_brand: headset_brand,
                phone_brand: phone_brand
            }, sort
            );
    }

    let headsetBrands = await db.getDeviceBrands("headset");
    let mouseBrands = await db.getDeviceBrands("mouse");
    let keyboardBrands = await db.getDeviceBrands("keyboard");
    let phoneBrands = await db.getDeviceBrands("phone");
    let monitorBrands = await db.getDeviceBrands("monitor");


    res.render('browse.html', {
        user: req.user,
        items: devices,
        headsetBrands: headsetBrands,
        mouseBrands: mouseBrands,
        keyboardBrands: keyboardBrands,
        phoneBrands: phoneBrands,
        monitorBrands: monitorBrands,
        filters: req.query
    });
});

app.get('/browse-select.html', async (req, res) => {
    let sort = req.query.sort;
    let type = req.query.Type;
    let id = req.query.id;

    

    let mouse_brand = req.query.mouse_brand;
    let keyboard_brand = req.query.keyboard_brand;
    let monitor_brand = req.query.monitor_brand;
    let headset_brand = req.query.headset_brand;
    let phone_brand = req.query.phone_brand;



    // Redirect instead of render?
    let devices = await db.getAllDevices
        (type, {
            mouse_brand: mouse_brand,
            keyboard_brand: keyboard_brand,
            monitor_brand: monitor_brand,
            headset_brand: headset_brand,
            phone_brand: phone_brand
        }, sort
        );
    let headsetBrands = await db.getDeviceBrands("headset");
    let mouseBrands = await db.getDeviceBrands("mouse");
    let keyboardBrands = await db.getDeviceBrands("keyboard");
    let phoneBrands = await db.getDeviceBrands("phone");
    let monitorBrands = await db.getDeviceBrands("monitor");

    res.render('browse-select.html', {
        items: devices,
        headsetBrands: headsetBrands,
        mouseBrands: mouseBrands,
        keyboardBrands: keyboardBrands,
        phoneBrands: phoneBrands,
        monitorBrands: monitorBrands,
        id: id
    });


});

app.get("/compare", async (req, res) => {
    let devices = [];

    for (const id in req.query) {
        devices.push((await db.getDeviceByID(req.query[id]))[0]);
    }
    res.render('compare.html', { user: req.user, devices: devices });
});

app.post("/compare", async (req, res) => {
    if (req.user) {
        for (i = 0; i < 4; i++) {
            if (!req.body.id[i]) {
                req.body.id[i] = null;
            }
        }
        let compare = await db.addComparison(req.user.userid, req.body.id[0], req.body.id[1], req.body.id[2], req.body.id[3]);
        res.redirect("/saved-comparison.html");
    }
    else {
        res.redirect("/signin.html");
    }
});



app.get("/contact.html", (req, res) => {
    res.render('contact.html', { user: req.user });
});

app.get("/history.html", async (req, res) => {
    // user only


    if (req.user) {
        let devicesHistory = await db.getHistory(req.user.userid);
        res.render('history.html', { user: req.user, devicesHistory: devicesHistory });

    } else {
        res.redirect("/");
    }
});

app.get("/item/:id", async (req, res) => {
    let id = req.params.id;

    // load device info
    let device = (await db.getDeviceByID(id))[0];

    // image path managing
    if (device.picture.startsWith(".")) {
        device.picture = "." + device.picture;
    }

    // load reviews.
    const reviews = await db.getAllReviews(id);

    //load prices
    var jarirPrice = await dataParser.getJarirPrice(device["jarir_link"]);
    var noonPrice = await dataParser.getNoonPrice(device["noon_link"]);

    var mouse_brand;
    var headset_brand;
    var keyboard_brand;
    var monitor_brand;
    var phone_brand;
    switch (device['category']) {
        case "headset":
            headset_brand = `'${device['manufacturer']}'`;
            break;

        case "keyboard":
            keyboard_brand = `'${device['manufacturer']}'`;
            break;

        case "mouse":
            mouse_brand = `'${device['manufacturer']}'`;
            break;

        case "monitor":
            monitor_brand = `'${device['manufacturer']}'`;
            break;

        case "phone":
            phone_brand = `'${device['manufacturer']}'`;
            break;
    }

    var type = `'${device['category']}'`

    let sort = "AZname"


    let similar_devices = await db.getAllDevices
        (type, {
            mouse_brand: mouse_brand,
            keyboard_brand: keyboard_brand,
            monitor_brand: monitor_brand,
            headset_brand: headset_brand,
            phone_brand: phone_brand
        }, sort
        );

    // save into history of user (if signed in)
    if (req.user) {
        await db.updateHistory(req.user.userid, id);
    }

    res.render(`item.html`, { user: req.user, data: device, reviews: reviews, jarir_price: jarirPrice, noon_price: noonPrice, similar_devices: similar_devices });
});


app.post("/postingReview", async (req, res) => {

    let comment = req.body.comment;
    let rating = req.body.rating;
    let deviceid = req.body.deviceid;

    await db.postingReview(req.user.userid, deviceid, comment, rating);
    res.redirect(`/item/${deviceid}`);
});


app.post('/brand', async (req, res) => {
    let brands = await db.getDeviceBrands(req.body.catagoery);

    res.json(brands);
});

app.post('/device', async (req, res) => {

    let devices = await db.getDeviceByBrand(req.body.name, req.body.catagoery);

    res.json(devices);
});

app.get("/modify.html", async (req, res) => {

    if (req.user && req.user.usertype === "admin") {
        if (!req.query.id) {
            res.render("modify.html");
        }
        else {
            let device = (await db.getDeviceByID(req.query.id))[0];

            res.render("modify.html", { device: device, user: req.user });
        }
    } else {
        res.redirect("/");
    }
});

app.post('/getDevice', async (req, res) => {
    let device = await db.getDeviceByID(req.id);
    res.json(device);
})


app.get("/profile-edit.html", async (req, res) => {
    if (req.user) {
        res.render('profile-edit.html', { user: req.user });
    } else {
        res.redirect("/");
    }
});


app.post("/profile-edit", async (req, res) => {
    if (req.files) {
        const profile_img = req.files.image;
        image_path = "./assets/profile_pics/" + req.session.userId + ".jpg"
        profile_img.mv(image_path);

        req.user.picture = image_path;
    }


    let newName = req.body.name;
    let newUsername = req.body.username;
    // todo profile picture
    req.user.name = newName;
    req.user.username = newUsername;


    await db.updateUser(req.user.userid, req.user);

    res.redirect("/profile.html");
});

app.get("/profile-password.html", (req, res) => {
    if (req.user) {
        res.render('profile-password.html', { user: req.user });
    } else {
        res.redirect("/");
    }
});

app.post("/password-change", async (req, res) => {

    oldPass = req.body.oldPassword;
    newPass = req.body.newPassword;

    newPassConfirm = req.body.newPasswordConfirm;

    if (newPass === newPassConfirm) {
        const result = await db.updatePassword(req.session.userId, oldPass, newPass);
        if (result.changes) {
            console.log("Changed Password Successfully");
            res.redirect("/profile-edit.html");
        } else {
            console.log("Password does not match old password");
        }
    } else {
        console.log("the two password does not match");
    }

});

app.get("/profile.html", (req, res) => {
    if (req.user) {
        res.render('profile.html', { user: req.user });
    } else {
        res.redirect("/");
    }
});

app.get("/saved-comparison.html", async (req, res) => {
    if (req.user) {

        let temp = [];
        let comparisons = [];
        let comparisonsIDs = await db.getComparisons(req.user.userid);
        let prev = comparisonsIDs[0]["comparisonID"];
        temp.push(comparisonsIDs[0]);
        for (i = 1; i < comparisonsIDs.length; i++) {
            if (comparisonsIDs[i]["comparisonID"] === prev) {
                temp.push(comparisonsIDs[i]);
            }
            else {
                comparisons.push(temp);

                temp = [];
                temp.push(comparisonsIDs[i]);
                prev = comparisonsIDs[i]["comparisonID"];

            }

        }
        comparisons.push(temp);
        res.render('saved-comparsion.html', { user: req.user, comparisons: comparisons });

    } else {
        res.redirect("/");
    }
});

app.post("/comparisonID", async (req, res) => {
    let ids = await db.getComparisonsIDs(req.body.comparisonID);

    res.json((ids[0]));
});
app.delete("/comparisonID", async (req, res) => {
    let ids = await db.deleteComparison(req.body.comparisonID);
    res.status(200).send();
});

app.post("/search", async (req, res) => {
    res.redirect("browse.html?search=" + req.body.search);
});

app.get("/signin.html", (req, res) => {
    res.render('signin.html', { user: req.user });
});

app.post("/signin.html", async (req, res) => {
    // user input
    let email = req.body.email;
    let password = req.body.password;

    // check and get user data
    user = await db.getUser(email, password);

    if (user) { // if correct
        req.session.userId = user.userid;

        pageData.userData = user;
        res.redirect("/");
    } else { // if not correct
        res.redirect("/signin.html");
    }

});

app.get("/signout", (req, res) => {
    req.session.destroy((e) => {
        if (e) throw e;
        res.redirect("/");
    });
});

app.get("/signup.html", (req, res) => {
    res.render('signup.html', { user: req.user });
});


app.post("/signup.html", async (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    await db.registeringUsers(name, username, email, password);
    res.redirect("/signin.html");
});




app.post("/signup", async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    await db.registeringUsers(username, email, password);
    res.redirect("/signin.html");
});


app.delete('/delete', async (req, res) => {

    let deleteDevice = db.deleteDevice(req.body.id);
    res.status(200).send();
})


app.post("/modifyingPrdouct/:id", async (req, res) => {

    var category = req.body.category.toLowerCase();

    //General Information
    var id = req.params.id;

    var brand = req.body.brand;
    var model = req.body.Model;
    var name = brand + " " + model;
    var jarir_link = req.body.jarir_link === "" ? req.body.jarir_link : null;
    var noon_link = req.body.noon_link === "" ? req.body.noon_link : null;

    // image upload
    if (req.files) {
        const img = req.files.image;
        image_path = "./assets/devices_pics/" + (name).replace(" ", "_") + ".jpg"
        img.mv(image_path);

        image = image_path;
    } else {
        image = "./assets/placeholder.jpg"
    }

    if (category === "monitor") {
        var width = req.body.resolution_x;
        var height = req.body.resolution_y;
        var size = req.body.size;
        var panel_type = req.body.panel_type;
        var refresh_rate = req.body.refresh_rate;
        var response_time = req.body.response_time;
        var brightness = req.body.brightness;
        var aspect_ratio_x = req.body.aspect_ratio_x;
        var aspect_ratio_y = req.body.aspect_ratio_y;
        var color = req.body.color;
        var wide_screen = req.body.wide_screen;
        var curve_screen = req.body.curve_screen;
        var speakers = req.body.speakers;
        await db.updateDevice(name, model, brand, image, category, jarir_link, noon_link);
        await db.updateMonitor(width, height, size, panel_type, refresh_rate, response_time, brightness, color, wide_screen, curve_screen, speakers, aspect_ratio_y, aspect_ratio_x, id);
        res.redirect("/modify.html");
    }

    else if (category === "phone") {
        var length = req.body.length;
        var width = req.body.width;
        var depth = req.body.depth;
        var screen_size = req.body.screen_size;
        var IP_rating = req.body.IP_rating;
        var display_type = req.body.display_type;
        var screen_to_body_ratio = req.body.screen_to_body_ratio;
        var weight = req.body.weight;
        var frequency = req.body.frequency;
        var resolution_x = req.body.resolution_h;
        var resolution_y = req.body.resolution_v;
        var ppi = req.body.pixel_density;
        var cpu = req.body.cpu;
        var chipset = req.body.chipset;
        var gpu = req.body.gpu;
        var memory = req.body.memory;
        var camera = req.body.camera;
        var phone_video = req.body.phone_video;
        var phone_selfie_camera = req.body.phone_selfie_camera;
        var battery = req.body.battery;
        var sensors = req.body.sensors;
        var charging_speed = req.body.charging_speed;
        var os = req.body.os;
        var headphone_jack = req.body.headphone_jack;
        var colors = req.body.colors;


        await db.updateDevice(name, model, brand, image, category, jarir_link, noon_link);
        await db.updatePhone(phone_video, IP_rating, resolution_x, resolution_y, length, width, depth, screen_size, display_type, screen_to_body_ratio, weight, frequency, ppi, cpu, chipset, gpu, memory, battery, camera, phone_selfie_camera, sensors, charging_speed, os, headphone_jack, colors, id);
        res.redirect("/modify.html");
    }

    else if (category === "mouse") {
        var length = req.body.length;
        var width = req.body.width;
        var height = req.body.height;
        var weight = req.body.weight;
        var sensor_type = req.body.sensor_type;
        var dpi = req.body.dpi;
        var max_acceleration = req.body.max_acceleration;
        var max_tracking_speed = req.body.max_tracking_speed;
        var polling_rate = req.body.polling_rate;
        var connectivity = req.body.connectivity;
        var number_of_buttons = req.body.number_of_buttons;
        var color = req.body.color;
        var onboard_memory = req.body.onboard_memory;
        var led_lighting = req.body.led_lighting;
        var adjustable_weight = req.body.adjustable_weight;

        await db.updateDevice(name, model, brand, image, category, jarir_link, noon_link);
        await db.updateMouse(length, width, height, weight, sensor_type, dpi, max_acceleration, max_tracking_speed, polling_rate, connectivity, number_of_buttons, color, onboard_memory, led_lighting, adjustable_weight, id);
        res.redirect("/modify.html");
    }

    else if (category === "keyboard") {
        var style = req.body.style;
        var switch_type = req.body.switch_type;
        var backlit = req.body.backlit;
        var tenkeyless = req.body.tenkeyless;
        var connection_type = req.body.connection_type;
        var color = req.body.color;


        await db.updateDevice(name, model, brand, image, category, jarir_link, noon_link);
        await db.updateKeyboard(style, switch_type, backlit, tenkeyless, connection_type, color, id);
        res.redirect("/modify.html");
    }

    else {
        var type = req.body.type;
        var max_frequency_response = req.body.max_frequency_response;
        var microphone = req.body.microphone;
        var wireless = req.body.wireless;
        var encloser_type = req.body.encloser_type;
        var color = req.body.color;
        var active_noise_cancelling = req.body.active_noise_cancelling;
        var channels = req.body.channels;
        var sensitivity = req.body.sensitivity;
        var impedance = req.body.impedance;
        await db.updateDevice(name, model, brand, image, category, jarir_link, noon_link);
        await db.updateHeadset(type, max_frequency_response, microphone, wireless, encloser_type, color, active_noise_cancelling, channels, sensitivity, impedance, id);
        res.redirect("/modify.html");
    }
});

app.post("/save", async (req, res) => {

});