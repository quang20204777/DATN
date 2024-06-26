const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dxzemhlui/image/upload/v1718014284/user_kzwivi.png"
    },
    otp: String,
    otpExpires: Date,
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
