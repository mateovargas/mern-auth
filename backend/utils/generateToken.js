import jwt from 'jsonwebtoken';

//JSON Webtoken. We can add something into the payload
//in this case, userId to help validate. We then save
//it in a cookie. Token lasts 30 days, cookie lasts 30 days
const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', //must be https in prod
        sameSite: 'strict', //prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
}

export default generateToken;