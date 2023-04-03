const express = require('express');
const Db=require('./app/db/db');
require('dotenv').config();
const app = express();
app.set("view engine",'hbs');

console.log(Db.Select("","").where('name','tak').where('yesy','yesy'));
/**
 *
 */
app.post("/token",(res,req)=>{

});

/**
 *
 */
app.post("/login",(req,res)=>{

});
/**
 *
 */
app.post("/logout",(req,res)=>{

});
app.get("/",(req,res)=>{
    res.render("index");
});

app.listen(3000);