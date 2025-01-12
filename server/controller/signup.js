const bcrypt = require('bcrypt');
const newUser = require('../models/signupSchema');
const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const entry = await newUser.create({
            firstName,
            lastName,
            email,
            password: hashedPass,
        });

        return res.status(201).json({
            status: "success",
            message: "User Created Successfully",
            user: {
                id: entry._id,
                firstName: entry.firstName,
                lastName: entry.lastName,
                email: entry.email,
            },
        });
    } catch (err) {
        console.error("Error during signup:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
module.exports = signup;
