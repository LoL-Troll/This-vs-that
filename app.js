const express = require("express");
const nunjucks = require("nunjucks");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const db = require("./db.js");
const dataParser = require("./dataParser.js");

const app = express();
const port = 8000;

app.use("/styles", express.static('styles'));
app.use("/assets", express.static('assets'));
app.use("/scripts", express.static('scripts'));


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

        // TODO cache
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


app.get("/about.html", (req, res) => {
    res.render('about.html', { user: req.user });
});

app.get("/add-product.html", (req, res) => {
    // admin only 
    // if session.isadmin
    if (req.user.usertype === "admin") {
        res.render('add-product.html', { user: req.user });
    } else {
        res.redirect("/");
    }
    // else 404
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
        monitorBrands: monitorBrands
    });
});

app.get("/compare", async (req, res) => {
    let devices = [];

    for (const key in req.query) {
        devices.push((await db.getDeviceByID(req.query[key]))[0]);
    }
    res.render('compare.html', { user: req.user, devices: devices });
});

app.get("/contact.html", (req, res) => {
    res.render('contact.html', { user: req.user });
});

app.get("/history.html", async (req, res) => {
    // user only
    
    console.log("VVVVVVVVVVVVVVVV");
    if (req.user) {
        let devicesHistory = await db.getHistory(req.user.userid);
        res.render('history.html', { user: req.user, devicesHistory: devicesHistory });

    } else {
        res.redirect("/");
    }
});

/////////////////////////////
app.get("/item/:id", async (req, res) => {
    let id = req.params.id;

    // load device info
    let devices = (await db.getDeviceByID(id))[0];

    // load reviews
    const reviews = await db.getAllReviews();

    //load prices
    var jarPrice = await dataParser.getJarirPrice(devices["jarir_link"]);
    var noonPrice = await dataParser.getNoonPrice(devices["noon_link"]);

    // save into history of user (if signed in)
    if (req.user) {
        await db.updateHistory(req.user.userid, id)
    }

    res.render(`item.html`, { user: req.user, data: devices, reviews: reviews, jarir_price: jarPrice, noon_price: noonPrice});
});


app.post("/postingReview", async (req, res) => {
    console.log("Entered the posting Review");
    let comment = req.body.comment;
    let rating = req.body.rating;
    let deviceid = req.body.deviceid;

    await db.postingReview(req.user.userid, deviceid, comment, rating);
    res.redirect(`/item/${deviceid}`);
});


app.get("/modify-product.html", (req, res) => {
    // if (req.user.usertype === "admin") {
    res.render('modify-product.html', { user: req.user });
    // } else {
    //     res.redirect("/");
    // }
});

app.get("/profile-edit.html", async (req, res) => {
    if (req.user) {
        res.render('profile-edit.html', { user: req.user });
    } else {
        res.redirect("/");
    }
});


app.post("/profile-edit", async (req, res) => {
    const profile_img = req.files.image;
    // req.session.userId + ".jpg"
    image_path = "./assets/profile_pics/" + req.session.userId + ".jpg"
    profile_img.mv(image_path);


    let newName = req.body.name;
    let newUsername = req.body.username;
    // todo profile picture
    req.user.name = newName;
    req.user.username = newUsername;
    req.user.picture = image_path;


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

app.get("/saved-comparison.html", (req, res) => {
    if (req.user) {
        res.render('saved-comparison.html', { user: req.user });
    } else {
        res.redirect("/");
    }
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

        // !!!!!!!!!!!!!!!!
        pageData.userData = user;
        res.redirect("/");
    } else { // if not correct
        res.redirect("/signin.html");
    }


    // res.render('signin.html');
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
    console.log("Entered the node js");
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    await db.registeringUsers(username, email, password);
    res.redirect("/signin.html");
});

app.post("/postingProduct", async (req, res) => {
    console.log("Entered the postingProduct");

    //General Information
    // let product_categorie = req.body.product_categorie;

    // let image = req.body.image;
    // let brand = req.body.brand;
    // let model = req.body.model;
    // let width = req.body.width;
    // let height = req.body.height;
    // let length = req.body.length;
    // let weight = req.body.weight;

    // //Common betweeen Phone and Monitor
    // let horizontal = req.body.horizontal;
    // let vertical = req.body.vertical;
    // let screen_size = req.body.screen_size;
    // var refresh_rate = req.body.refresh_rate;
    // let pixel_density = req.body.pixel_density
    // let brightness = req.body.brightness;

    // //Monitor
    // let display_type = req.body.display_type;
    // let panel = req.body.panel;
    // var refresh_rate = req.body.refresh_rate;
    // let response_time = req.body.response_time;

    // //Phone
    // let ram = req.body.ram;
    // let battery = req.body.battery;
    // let storage = req.body.internal_storage;
    // let mega_pixel = req.body.mega_pixel;
    // let sim = req.body.sim;
    // let charging = req.body.charging_speed;
    // let resistance = req.body.resistance;
    // let wirless_charing = req.body.wirless_charing
    // let fingerprint = req.body.Fingerprint;

    if (product_categorie === "Monitor") {
        db.addMonitor(screen_size, horizontal, vertical, refresh_rate, response_time, panel, brightness);
        db.addDevice(model, brand, image, product_categorie);
        res.render("/add-product.html");
    }

});







