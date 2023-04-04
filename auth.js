const express = require('express');
const Db=require('./app/db/db');
const Auth=require('./app/middlewares/authMidleware');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const app = express();
app.use(express.json());
app.set("view engine",'hbs');


app.get("/",(req,res)=>{
    Db.select("users").get().then((res)=>{
        console.log(res);
    });
    res.render("index");
});

/**
 * register route
 */
app.post("/register", async (req, res)=>{
    var status;
    await Db.select('users','email').where('email',req.body.email).first().then((response)=>{
        if(response.length !== 0){
            status = res.status(400).send("User already exists");
        }
    }).catch(()=>{
        status = res.status(500).send("Unknown error. Please contact page admin");
    });
    if( status !== undefined){
        return status;
    }
    const userData={
        email:req.body.email,
        password: await bcrypt.hash(req.body.password,10),
        refresh_token:"",
    };
    Db.insert('users',userData).get().then(()=>{
        delete result['userData'];
        return res.status(200).json({
            user:userData,
            accessToken:jwt.sign(
                JSON.parse(JSON.stringify(userData)),
                process.env.APP_SECRET_KEY
            ),
        });
    }).catch(()=>{
        return res.status(500).send("Unknown error. Please contact page admin");
    });

});

/**
 * login route
 */
app.post("/login", async (req,res)=>{

    const userData = {email:req.body.email , password:req.body.password};
    try{
        let result = Db.select("users").where('email',userData.email).limit(1).first();
        await result.then((result) => {
            if(result.length === 0) return res.status(400).send("User not found");

            if (bcrypt.compare(userData.password, result.password)) {
                delete result['password'];
                return res.status(200).json({
                    user:result,
                    accessToken:jwt.sign(
                        JSON.parse(JSON.stringify(result)),
                        process.env.APP_SECRET_KEY
                    ),
                });
            }
            return res.status(403).send("Unauthorized!");
        });
        //
    }catch (e) {
        console.error(e);
        return res.status(500).send("Unknown error. Please contact page admin");
    }

});

app.post("/logout", Auth,(req,res)=>{
    return res.status(200).send();
});


app.listen(3000);