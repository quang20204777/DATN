const router = require("express").Router();
const moment = require("moment");
const authMiddleware = require("../middlewares/auth");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const QRCode = require("qrcode");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// book shows
router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    // save booking
    const newBooking = new Booking(req.body);
    const user = await User.findById(req.body.userId);
    await newBooking.save();

    const show = await Show.findById(req.body.show);
    // update seats
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: [...show.bookedSeats, ...req.body.seats],
    });

    // Tạo mã QR từ bookingId
    const qrCodeData = await QRCode.toDataURL(newBooking._id.toString(), {
      format: "url",
    });

    // Upload hình ảnh QR code lên Cloudinary
    const result = await cloudinary.uploader.upload(qrCodeData, {
      folder: "qrcodes",
    });

    // Lấy URL của hình ảnh QR code từ Cloudinary
    const qrCodeUrl = result.secure_url;

    // Gửi email cho người dùng
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "thanhquangnguyenhien@gmail.com",
      to: user.email, // Thay đổi thành địa chỉ email của người dùng
      subject: "Xác nhận đặt vé",
      html: `
        <p>Xin chào,</p>
        <p>Bạn đã đặt vé thành công. Vui lòng sử dụng mã QR sau để checkin khi đến rạp:</p>
        <img src="${qrCodeUrl}" alt="QR Code">
        <p>Xin cảm ơn.</p>
      `,
    };

    // Gửi email
    transporter.sendMail(mailOptions);
    res.send({
      success: true,
      message: "Đặt phim thành công!",
      data: newBooking,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all bookings by user
router.get("/get-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate("user")
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    res.send({
      success: true,
      message: "Danh sách vé đã đặt thành công!",
      data: bookings,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/checkin", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.body.bookingId).populate("show");
    if (!booking) return res.send({
      success: false,
      message: "Không tìm thấy vé với ID đã cung cấp!"
    })

    if (booking.statusCheckin === 1) {
      return res.send({
        success: false,
        message: "Vé đã được sử dụng!",
      });
    }
    if (booking.statusCheckin === -1) {
      return res.send({
        success: false,
        message: "Vé đã hết hạn!",
      });
    }

    if (
      booking.statusCheckin === 0 &&
      moment(booking.show.date).isSame(moment(), "day") &&
      moment(booking.show.endTime, "HH:mm").isBefore(moment(), "hour")
    ) {
      await Booking.findByIdAndUpdate(req.body.bookingId, {
        statusCheckin: -1,
      });
      return res.send({
        success: false,
        message: "Vé đã hết hạn!",
      });
    }
    booking.statusCheckin = 1;
    await booking.save();
    res.send({
      success: true,
      message: "Checkin thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//cron jib
var CronJob = require("cron").CronJob;
var job = new CronJob("0 0 * * *", async () => {
  try {
    const currentDate = moment().startOf("day");

    // Tìm các booking cần cập nhật trạng thái
    const bookings = await Booking.find().populate("show");
    bookings.forEach(async (booking) => {
      if (
        booking.statusCheckin === 0 &&
        (moment(booking.show.date).isBefore(moment().startOf("day")) ||
          (moment(booking.show.date).isSame(moment(), "day") &&
            moment(booking.show.endTime, "HH:mm").isBefore(moment(), "hour")))
      ) {
        await Booking.findByIdAndUpdate(booking._id, { statusCheckin: -1 });
      }
    });
    console.log("Booking status updated successfully.");
  } catch (error) {
    console.error("Error updating booking status:", error);
  }
});

job.start();

module.exports = router;
