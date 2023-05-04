const express = require("express");
const nunjucks = require("nunjucks")
const fs = require('fs');

const app = express();
const port = 8000;

app.use("/styles", express.static('styles'));
app.use("/assets", express.static('assets'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});



app.get("/", (req, res) => {
    var data = JSON.parse(fs.readFileSync("phone.json"))



    res.render('item.html', {data:data});});

app.get("/browse.html", (req, res) => {
    res.render('browse.html', {name: "YAHYA"});
});

app.listen(port, (e) => {
    console.log("listing on port " + port);
});

function jsonNameConvert(data){
    var map = JSON.parse(fs.readFileSync("map.json"));
    // for(let [key, value] in map){
    //     console.log(map["length"], value);
    //     data[1].value = data[1].key;
    //     delete data[1].key;
    // }

    if(data[1]["resolution_h"]){
        data[1]["Resolution"] = data[1]["resolution_v"] + "x" + data[1]["resolution_h"]
        delete data[1]["resolution_h"];
        delete data[1]["resolution_v"];
    }

    Object.entries(map).forEach(([key, value]) => {
        renameKey(data[1], key, value);
    })
    

    return data;
}

function renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }