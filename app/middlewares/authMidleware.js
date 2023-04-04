const express = require('express');
const jwt=require('jsonwebtoken');

/**
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
function AuthMiddleware(req,res,next) {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1];
    if(token === null) return res.status(403).send();
    jwt.verify(token,process.env.APP_SECRET_KEY,(err,user)=>{
        if(err) return res.status(403).send();
        req.user = user;
        next();
    });
    return res.status(403).send();
}

module.exports=AuthMiddleware;