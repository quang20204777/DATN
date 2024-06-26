const router = require("express").Router();
const CryptoJS = require("crypto-js");
const axios = require("axios");
const moment = require("moment");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const User = require("../models/userModel");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const qs = require("qs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//zalopay 
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
router.post("/create-payment-zalopay", async (req, res) => {
  const { amount, orderInfo, show, seats, totalPrice, user } = req.body;
  const embed_data = {
    //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
    redirecturl: "http://localhost:3000/book-show",
    show: show,
    seats: seats,
    totalPrice: totalPrice,
    user: user,
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
    //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
    callback_url:
      "https://6ebd-2405-4802-1d8c-b180-50b9-4b09-3009-91bb.ngrok-free.app/api/payments/callback",
    description: `${orderInfo}`,
    bank_code: "",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
});

// Endpoint để nhận callback từ Zalopay
router.post("/callback", async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr, config.key2);
      const bookdata = JSON.parse(dataJson.embed_data);
      const newBooking = new Booking({
        show: bookdata.show,
        user: bookdata.user,
        seats: bookdata.seats,
        totalPrice: bookdata.totalPrice,
        transactionId: dataJson.app_trans_id,
      });

      await newBooking.save();

      //check user
      const user = await User.findById(bookdata.user);

      const show = await Show.findById(bookdata.show);
      // update seats
      await Show.findByIdAndUpdate(bookdata.show, {
        bookedSeats: [...show.bookedSeats, ...bookdata.seats],
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

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

// Endpoint to check payment status before booking
router.post("/check-payment-status", async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: config.app_id,
    app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
    /**
     * kết quả mẫu
      {
        "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
        "return_message": "",
        "sub_return_code": 1,
        "sub_return_message": "",
        "is_processing": false,
        "amount": 50000,
        "zp_trans_id": 240331000000175,
        "server_time": 1711857138483,
        "discount_amount": 0
      }
    */
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
});

//vnpay
const config_vnpay = {
  // Thông tin từ VNPay
  vnp_TmnCode: "5SMJ5YC4",
  vnp_HashSecret: "DGRFGGIWDSZJILRLFVIIQYIMUPVNHCHI",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:5000/api/payments/vnpay_return",
};
router.post("/create-payment-vnpay", async (req, res) => {
  const { amount, show, seats, totalPrice, user } = req.body;
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  let tmnCode = config_vnpay.vnp_TmnCode;
  let secretKey = config_vnpay.vnp_HashSecret;
  let vnpUrl = config_vnpay.vnp_Url;
  let returnUrl = config_vnpay.vnp_ReturnUrl;
  let orderInfo = JSON.stringify({ show, user, seats });
  // Lấy thời gian hiện tại
  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-T:\.Z]/g, "")
    .slice(0, 14);
  const orderId = date.getTime();
  let bankCode = "VNBANK";
  let locale = "vn";
  let currCode = "VND";
  let vnp_Params = {};

  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  vnp_Params["vnp_BankCode"] = bankCode;
  // vnp_Params["vnp_Show"] = show;
  // vnp_Params["vnp_Seats"] = seats;
  // vnp_Params["vnp_User"] = user;

  vnp_Params = sortObject(vnp_Params);
  let signData = qs.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });
  res.send({ order_url: vnpUrl });
});

router.get("/vnpay_return", async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let tmnCode = config_vnpay.vnp_TmnCode;
  let secretKey = config_vnpay.vnp_HashSecret;

  let signData = qs.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    // Thanh toán thành công
    const orderId = vnp_Params["vnp_TxnRef"];
    const amount = vnp_Params["vnp_Amount"] / 100;
    const responseCode = vnp_Params["vnp_ResponseCode"];
    let orderInfo;
    if (vnp_Params.vnp_OrderInfo.includes("%22")) {
      // Chuỗi đã được mã hóa, cần giải mã
      orderInfo = JSON.parse(decodeURIComponent(vnp_Params.vnp_OrderInfo));
    } else {
      // Chuỗi chưa được mã hóa, có thể sử dụng trực tiếp
      orderInfo = JSON.parse(vnp_Params.vnp_OrderInfo);
    }
    const { show, user, seats } = orderInfo;

    if (responseCode == "00" || responseCode == "07") {
      const newBooking = new Booking({
        show: show,
        user: user,
        seats: seats,
        totalPrice: amount,
        transactionId: vnp_Params['vnp_TransactionNo'],
      });
  
      await newBooking.save();
  
      //check user
      const checkUser = await User.findById(user);
  
      const checkShow = await Show.findById(show);
      // update seats
      await Show.findByIdAndUpdate(show, {
        bookedSeats: [...checkShow.bookedSeats, ...seats],
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
        to: checkUser.email, // Thay đổi thành địa chỉ email của người dùng
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
      res.redirect(
        `http://localhost:3000/book-show?orderId=${orderId}&amount=${amount}&responseCode=${responseCode}&showId=${show}&userId=${user}&seats=${seats}`
      );
    } else {
      res.redirect(`http://localhost:3000/book-show?orderId=${orderId}&amount=${amount}&responseCode=${responseCode}&showId=${show}&userId=${user}&seats=${seats}`)
    }
  } else {
    res.send("Thất bại!");
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

//momo
const config_momo = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: 'http://localhost:5000/views/home.html',
  ipnUrl: 'https://0778-14-178-58-205.ngrok-free.app/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
  requestType: 'payWithMethod',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
}
router.post('/create-payment-momo', async ( req, res) => {

})

module.exports = router;
