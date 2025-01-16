const bcrypt = require("bcrypt");
const newUser = require("../models/signupSchema");
const jwt = require("jsonwebtoken");
const key = process.env.SECRET_KEY;
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
    const payload = {
      id: entry._id,
    };
    const token = jwt.sign(payload, key, { expiresIn: "2h" });
    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: false, // Set to true if using HTTPS (false for localhost)
      sameSite: "strict", // Helps mitigate CSRF attacks
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
