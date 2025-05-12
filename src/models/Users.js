const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String, 
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;