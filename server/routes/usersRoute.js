const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");
const sendOTPByEmail = require("../utils/mail.js");
const OTP = require("otp-generator");

//register
router.post("/register", async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  try {
    //Kiểm tra user tồn tại hay chưa?
    const userExist = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (userExist) {
      return res.send({
        success: false,
        message: "Người dùng đã tồn tại!",
      });
    }

    //Băm password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Lưu user
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      address: address,
      password: hashedPassword,
    });
    newUser.save();

    res.send({
      success: true,
      message: "Đăng ký thành công, hãy đăng nhập!",
    });
  } catch (error) {
    res.send({
      success: false,
      messsage: error.messsage,
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    // check if user exists
    let user;
    if (/^\d+$/.test(emailOrPhone)) {
      // Kiểm tra nếu toàn bộ là số (số điện thoại)
      user = await User.findOne({ phone: emailOrPhone });
    } else {
      // Ngược lại là email
      user = await User.findOne({ email: emailOrPhone });
    }
    if (!user) {
      return res.send({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Sai mật khẩu",
      });
    }

    // create and assign a token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "Đăng nhập thành công",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//Quên mật khẩu
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    const otp = OTP.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    user.otp = otp;
    user.otpExpires = Date.now() + 120000; //OTP có hiệu lực trong vòng p
    await user.save();
    await sendOTPByEmail(email, otp);
    res.send({ success: true });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
//Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.send({ success: true, message: "Mật khẩu đã được đặt lại!" });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Get user information by id
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");
    res.send({
      success: true,
      message: "Lấy thông tin chi tiết người dùng thành công!",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Chỉnh sửa thông tin người dùng
router.put("/update-current-user", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, req.body);
    res.send({
      success: true,
      message: "Cập nhật thông tin người dùng thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Thay đổi mật khẩu
router.put("/change-password", authMiddleware, async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.send({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }
    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Mật khẩu của bạn không đúng!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.send({
      success: true,
      message: "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//Upload image
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/uploadimage",
  upload.single("quangimage"),
  authMiddleware,
  async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.json({ success: false, message: "No image file provided" });
    }

    sharp(file.buffer)
      .resize({ width: 800 })
      .toBuffer(async (err, data, info) => {
        if (err) {
          console.error("Image processing error:", err);
          return res.json({
            success: false,
            message: "Error processing image",
          });
        }

        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, async (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return res.json({
                success: false,
                message: "Error uploading image to Cloudinary",
              });
            }
            const user = await User.findByIdAndUpdate(req.body.userId, {
              avatar: result.url,
            });
            if (!user)
              return res.json({
                success: false,
                message: "Người dùng không tồn tại",
              });
            res.json({
              success: true,
              data: result.url,
              message: "Thay đổi ảnh đại diện thành công.",
            });
          })
          .end(data);
      });
  }
);

//get all user
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user.isAdmin) {
      res.send({
        success: false,
        message: "Chỉ có quản trị viên có thể thực hiện yêu cầu này",
      });
    }

    const users = await User.find({ isAdmin: false }).sort({ createAt: -1 }).select('-password -isAdmin');
    res.send({
      success: true,
      message: "Lấy danh sách người dùng thành công!",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete user
router.post("/delete-user", authMiddleware, async (req, res) => {
  try {
    const { accountId } = req.body;
    const user = await User.findById(req.body.userId);
    if (!user.isAdmin)
      return res.send({
        success: false,
        messgae: "Chỉ quản trị viên có thể xóa tài khoản!",
      });
    await User.findByIdAndDelete(accountId);
    res.send({
      success: true,
      message: "Xóa tài khoản thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
