import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    //set token to name of token cookie. 
    //doable bc of cookie parser
    token = req.cookies.jwt;

    if (token) {
        try {
            //gets decoded object that has user id, looks for the user,
            //then we set req.user to the user that matches
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //returns user without password.
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not Authorized: Invalid Token');
        }
    } else {
        res.status(401);
        throw new Error('Not Authorized');
    }
});

export { protect };