const express = require('express');
require('dotenv').config();
const app = express();
app.set("view engine",'hbs');

app.get("/",(req,res)=>{
    console.log("/");
    res.render("index");
});

app.listen(3000);