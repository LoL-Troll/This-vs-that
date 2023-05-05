const express = require("express");
const nunjucks = require("nunjucks");

const app = express();
const port = 8000;

app.use("/styles", express.static('styles'));
app.use("/assets", express.static('assets'));
app.use("/scripts", express.static('scripts'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.listen(port, (e) => {

    console.log("listing on port " + port);
});

// TODO middleware to check login ?

const db = require("./db.js");


app.get("/", async (req, res) => {
    res.render('index.html');
});



app.get("/about.html", (req, res) => {
    res.render('about.html');
});

app.get("/add-product.html", (req, res) => {
    // admin only
    res.render('add-product.html');
});

app.get("/browse.html", async (req, res) => {
    let sort = req.query.sort;
    let type = req.query.Type;

    let mouse_brand = req.query.mouse_brand;
    let keyboard_brand = req.query.keyboard_brand;
    let monitor_brand = req.query.monitor_brand;
    let headset_brand = req.query.headset_brand;
    let phone_brand = req.query.phone_brand;



    console.log(sort + " " + type + ".");
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
    res.render('browse.html', {
        items: devices,
        headsetBrands: headsetBrands,
        mouseBrands: mouseBrands,
        keyboardBrands: keyboardBrands,
        phoneBrands: phoneBrands,
        monitorBrands: monitorBrands
    });
});

app.get("/compare.html", (req, res) => {
    res.render('compare.html');
});

app.get("/contact.html", (req, res) => {
    res.render('contact.html');
});

app.get("/history.html", (req, res) => {
    // user only
    res.render('history.html');
});

app.get("/item.html", (req, res) => {
    res.render('item.html');
});

app.get("/modify-product.html", (req, res) => {
    res.render('modify-product.html');
});

app.get("/profile-edit.html", (req, res) => {
    res.render('profile-edit.html');
});

app.get("/profile-password.html", (req, res) => {
    res.render('profile-password.html');
});

app.get("/profile.html", (req, res) => {
    res.render('profile.html');
});

app.get("/saved-comparison.html", (req, res) => {
    res.render('saved-comparison.html');
});

app.get("/signin.html", (req, res) => {
    res.render('signin.html');
});

app.get("/signup.html", (req, res) => {

    res.render('signup.html');
});

app.post("/signup", async (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    await db.registeringUsers(username, email, password);

    res.redirect("/signin.html");
});










