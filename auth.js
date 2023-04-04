const express = require('express');
const Db=require('./app/db/db');
const Auth=require('./app/middlewares/authMidleware');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const app = express();
app.use(express.json());
app.set("view engine",'hbs');

const generateAccessToken=(user)=>{
    return jwt.sign(
        JSON.parse(JSON.stringify(user)),
        process.env.APP_SECRET_KEY,
        {expiresIn: "15m"}
    )
};
const generateRefreshToken=(user)=>{
    let RefreshToken= jwt.sign(
        JSON.parse(JSON.stringify(user)),
        process.env.APP_REFRESH_KEY,
    );
    Db.insert('refresh_tokens',{token:RefreshToken}).get();
    return RefreshToken;
};


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
        const refresh_token=generateRefreshToken(userData);

        return res.status(200).json({
            user:userData,
            accessToken: generateAccessToken(userData),
            refreshToken:refresh_token
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
                const refresh_token=generateRefreshToken(userData);
                return res.status(200).json({
                    user:result,
                    accessToken:generateAccessToken(result),
                    refreshToken:refresh_token,
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

/**
 * refresh access token route
 */
app.post("/token", async (req,res)=>{
    const  refreshToken=req.body.refreshToken;
    if(refreshToken == null) return res.sendStatus(401);
    var status;
    await Db.select('refresh_tokens').where('token',refreshToken).first().then((response)=>{
        if(response.length ===0){
            status = res.sendStatus(403);
        }
    }).catch((err)=>{
        console.error(err);
        status = res.status(500).send("Unknown error. Please contact page admin");
    });
    if(status !== undefined){
        return status;
    }

    jwt.verify(refreshToken,process.env.APP_REFRESH_KEY,(err,user)=>{
       if(err) return res.sendStatus(403);
       return res.json({
           accessToken:generateAccessToken(user),
       })
    });

});


app.post("/logout",Auth,(req,res)=>{
    const  refreshToken=req.body.refreshToken;
    if(refreshToken == null) return res.sendStatus(401);
    var status;
    Db.delete('refresh_tokens').where('token',refreshToken).get().catch((err)=>{
        console.error(err);
        status = res.status(500).send("Unknown error. Please contact page admin");
    });
    if(status !== undefined) return status;
    res.sendStatus(204);
});


app.listen(3000);