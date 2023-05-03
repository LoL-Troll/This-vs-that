const express = require("express");
const nunjucks = require("nunjucks")

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


app.get("/", (req, res) => {
    res.render('index.html', {name: "YAHYA"});
});


app.get("/about.html", (req, res) => {
    res.render('about.html');
});

app.get("/add-product.html", (req, res) => {
    // admin only
    res.render('add-product.html');
});

app.get("/browse.html", (req, res) => {
    res.render('browse.html');
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










