const express = require('express');
const Db=require('./app/db/db');
require('dotenv').config();

const app = express();
app.set("view engine",'hbs');

Db.update("users",{email:"mikeyy@test.pl"}).where("email",'mike@test.pl').get();

app.get("/",(req,res)=>{
    Db.select("users").get().then((res)=>{
        console.log(res);
    });

    res.render("index");
});

app.listen(3000);