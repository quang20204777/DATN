const router = require("express").Router();
const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/auth");
const Show = require("../models/showModel");
const moment = require('moment')

// Add a new movie
router.post("/add-movie", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user)
      return res.send({
        success: false,
        messgae: "Không tìm thấy quản trị viên",
      });
    if (!user.isAdmin)
      return res.send({
        success: false,
        messgae: "Chỉ quản trị viên mới được thêm phim!",
      });
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.send({
      success: true,
      message: "Thêm phim thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all movies
router.get("/get-all-movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Lấy danh sách phim thành công!",
      data: movies,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update a movie
router.post("/update-movie", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user)
      return res.send({
        success: false,
        messgae: "Không tìm thấy quản trị viên",
      });
    if (!user.isAdmin)
      return res.send({
        success: false,
        messgae: "Chỉ quản trị viên mới được chỉnh sửa phim!",
      });
    await Movie.findByIdAndUpdate(req.body.movieId, req.body);
    res.send({
      success: true,
      message: "Cập nhật phim thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a movie
router.post("/delete-movie", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user)
      return res.send({
        success: false,
        messgae: "Không tìm thấy quản trị viên!",
      });
    if (!user.isAdmin)
      return res.send({
        success: false,
        messgae: "Chỉ quản trị viên có thể xóa phim!",
      });
    const checkShow = await Show.find({movie: req.body.movieId})
    if (checkShow) return  res.send({
      success: false,
      message: "Phim đang có lịch chiếu!",
    });
    await Movie.findByIdAndDelete(req.body.movieId);
    res.send({
      success: true,
      message: "Xóa phim thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get a movie by id
router.get("/get-movie-by-id/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send({
      success: true,
      message: "Lấy dữ liệu phim thành công!",
      data: movie,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/now-playing", (req, res) => {
  const today = moment().startOf('day');

  Show.aggregate([
    {
      $match: {
        date: {
          $gte: today.toDate(), // Lọc các show có ngày lớn hơn hoặc bằng ngày hiện tại
          $lt: moment(today).add(1, 'day').toDate(), // Lọc các show có ngày nhỏ hơn ngày mai
        },
      },
    },
    {
      $group: {
        _id: "$movie",
        movie: { $first: "$$ROOT" }, // Chọn một bộ phim duy nhất trong mỗi nhóm
      },
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "_id",
        as: "movie_info",
      },
    },
    {
      $addFields: {
        movie_info: { $arrayElemAt: ["$movie_info", 0] }, // Lấy ra thông tin phim từ mảng
      },
    },
    {
      $replaceRoot: { newRoot: "$movie_info" }, // Đặt lại document gốc là thông tin của bộ phim
    },
    {
      $sort: { createdAt: -1 } // Sắp xếp theo thời gian tạo, -1 để sắp xếp giảm dần
    }
  ])
    .then((result) => {
      res.send({
        success: true,
        message: "Lấy dữ liệu phim đang chiếu thành công!",
        data: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    });
});

router.get("/coming-soon", (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set giờ, phút, giây, mili giây về 0 để so sánh ngày

  Show.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Lọc các show có ngày lớn hơn or bằng ngày mai
        },
      },
    },
    {
      $group: {
        _id: "$movie",
        movie: { $first: "$$ROOT" }, // Chọn một bộ phim duy nhất trong mỗi nhóm
      },
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "_id",
        as: "movie_info",
      },
    },
    {
      $addFields: {
        movie_info: { $arrayElemAt: ["$movie_info", 0] }, // Lấy ra thông tin phim từ mảng
      },
    },
    {
      $replaceRoot: { newRoot: "$movie_info" }, // Đặt lại document gốc là thông tin của bộ phim
    },
    {
      $sort: { createdAt: -1 } // Sắp xếp theo thời gian tạo, -1 để sắp xếp giảm dần
    }
  ])
    .then((result) => {
      res.send({
        success: true,
        message: "Lấy dữ liệu phim sắp chiếu thành công",
        data: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    });
});

module.exports = router;
