const express = require('express');
const Db=require('./app/db/db');
require('dotenv').config();
const app = express();
app.set("view engine",'hbs');
Db.insert("users",{
    email:"rob@test.pl",
    password:"password",
    refresh_token:"eelelelelel",
}).then((res)=>{
    console.log(res);
});
app.get("/",(req,res)=>{
    Db.Select("users").get().then((res)=>{
        console.log(res);
    });

    res.render("index");
});

app.listen(3000);