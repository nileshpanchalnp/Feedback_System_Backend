const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User SingUp Logic
const userCreate = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ( !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "username, email, and password are required."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      data: newUser
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// User Login Logic
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: user._id,
        email: user.email,
        username: user.username
      },
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = { userCreate, userLogin };