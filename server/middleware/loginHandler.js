const login = require('../models/signupSchema');
const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;
const loginMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }
    try {
        const decodedToken = jwt.verify(token, key);
        const user = await login.findOne({ _id: decodedToken.id });
        if (user) {
            req.user = user;
            return next();
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.clearCookie(token);
        next();
    }
};

module.exports = loginMiddleware;
