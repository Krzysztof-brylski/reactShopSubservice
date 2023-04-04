const express = require('express');
const Db=require('./app/db/db');
require('dotenv').config();
const app = express();
app.set("view engine",'hbs');

app.get("/",(req,res)=>{
    Db.Select("users").get().then((res)=>{
        console.log(res);
    });

    res.render("index");
});

app.listen(3000);