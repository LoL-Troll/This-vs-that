const express = require("express");
const nunjucks = require("nunjucks");

const app = express();
const port = 8000;

app.use("/styles", express.static('styles'));
app.use("/assets", express.static('assets'));
app.use("/scripts", express.static('scripts'));

// public varibles
const db = require("./db.js");
const session = require('express-session');
const bodyParser = require('body-parser');
const pageData = { signedIn: false, isAdmin: undefined, userData: undefined };


// Middlewares
app.use(session({
    name: 'session',
    keys: ['key1', 'key2'],
    secret: "hash",
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    // if there is a cookie, and user is signed in
    if (req.session && req.session.userId) {
        pageData.signedIn = true;
        pageData.isAdmin = req.session.isAdmin;
    }
    else { // user is signed out
        pageData.signedIn = false;
        pageData.isAdmin = false;
        pageData.userData = undefined;
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


//////////////
// Handlers //
//////////////
app.get("/", async (req, res) => {
    res.render('index.html', { ...pageData });
});


app.get("/about.html", (req, res) => {
    res.render('about.html', { ...pageData });
});

app.get("/add-product.html", (req, res) => {
    // admin only 
    // if session.isadmin
    if (pageData.isAdmin) {
        res.render('add-product.html', { ...pageData });
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
        ...pageData,
        items: devices,
        headsetBrands: headsetBrands,
        mouseBrands: mouseBrands,
        keyboardBrands: keyboardBrands,
        phoneBrands: phoneBrands,
        monitorBrands: monitorBrands
    });
});

app.get("/compare.html", (req, res) => {
    res.render('compare.html', { ...pageData });
});

app.get("/contact.html", (req, res) => {
    res.render('contact.html', { ...pageData });
});

app.get("/history.html", (req, res) => {
    // user only
    if (pageData.signedIn) {

        res.render('history.html', { ...pageData });
    } else {
        res.redirect("/");
    }

});

app.get("/item", async (req, res) => {
    let devices = (await db.getDeviceByID(req.query.id))[0];
    res.render(`item.html`, { data: devices });
});


app.get("/modify-product.html", (req, res) => {
    if (pageData.isAdmin) {
        res.render('modify-product.html', { ...pageData });
    } else {
        res.redirect("/");
    }
});

app.get("/profile-edit.html", (req, res) => {
    if (pageData.signedIn) {
        res.render('profile-edit.html', { ...pageData });
    } else {
        res.redirect("/");
    }
});

app.get("/profile-password.html", (req, res) => {
    if (pageData.signedIn) {
        res.render('profile-password.html', { ...pageData });
    } else {
        res.redirect("/");
    }
});

app.get("/profile.html", (req, res) => {
    if (pageData.signedIn) {
        res.render('profile.html', { ...pageData });
    } else {
        res.redirect("/");
    }
});

app.get("/saved-comparison.html", (req, res) => {
    if (pageData.signedIn) {
        res.render('saved-comparison.html', { ...pageData });
    } else {
        res.redirect("/");
    }
});

app.post("/search", async (req, res) => {
    console.log(req.body);
    res.redirect("browse.html?search=" + req.body.search);
});

app.get("/signin.html", (req, res) => {
    res.render('signin.html', { ...pageData });
});

app.post("/signin.html", async (req, res) => {
    // user input
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body)

    // check and get user data
    user = await db.getUser(email, password);


    if (user) { // if correct
        req.session.userId = user.userid;
        req.session.isAdmin = user.userType == "admin";

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
    res.render('signup.html', { ...pageData });
});


app.post("/signup.html", async (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    await db.registeringUsers(name, username, email, password);
    res.redirect("/signin.html");
});


app.get("/item.html", async(req, res) => {
    // user only
    const reviews = await db.getAllReviews();
    
    res.render('/item.html' , {reviews: reviews});
    
});

app.post("/postingReview", async(req,res) =>{
    console.log("Entered the postingReview");
    var comment = req.body.comment;
    var rating = req.body.rating;
    await db.postingReview(comment,rating);
    res.get("/item.html");
});

app.post("/signup",  async(req,res) => {
    console.log("Entered the node js");
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    await db.registeringUsers(username,email,password);
    res.redirect("/signin.html");
});

app.post("/postingProduct", async(req,res) =>{
    console.log("Entered the postingProduct");

    //General Information
    var product_categorie = req.body.product_categorie;

    var image = req.body.image;
    var brand = req.body.brand;
    var model = req.body.model;
    var width = req.body.width;
    var height = req.body.height;
    var length = req.body.length;
    var weight = req.body.weight;

    //Common betweeen Phone and Monitor
    var horizontal = req.body.horizontal;
    var vertical = req.body.vertical;
    var screen_size = req.body.screen_size;
    var refresh_rate = req.body.refresh_rate;
    var pixel_density = req.body.pixel_density
    var brightness = req.body.brightness;

    //Monitor
    var display_type = req.body.display_type;
    var panel = req.body.panel;
    var refresh_rate = req.body.refresh_rate;
    var response_time = req.body.response_time;

    //Phone
    var ram = req.body.ram;
    var battery = req.body.battery;
    var storage = req.body.internal_storage;
    var mega_pixel = req.body.mega_pixel;
    var sim = req.body.sim;
    var charging = req.body.charging_speed;
    var resistance = req.body.resistance;
    var wirless_charing = req.body.wirless_charing
    var fingerprint = req.body.Fingerprint;

    if(product_categorie === "Monitor"){
        db.addMonitor(screen_size,horizontal,vertical,refresh_rate,response_time, panel, brightness);
        db.addDevice(model, brand, image, product_categorie);
        res.render("/add-product.html");
    }

});









