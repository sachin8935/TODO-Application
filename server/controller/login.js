const login = require('../models/signupSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

const loginUser = async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json({
                success: true,
                message: "User is already logged in",
                user: req.user,
            });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const payload = { id: user._id };
        const token = jwt.sign(payload, key, { expiresIn: "2h" });
        console.log(token);
        // Set the cookie with proper options
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "none",
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });
        user.password = undefined;
        return res.status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = loginUser;