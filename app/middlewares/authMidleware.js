const express = require('express');


/**
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
export default function AuthMiddleware(req,res,next) {

    next();
}
