const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const Theatre = require("../models/theatreModel");
const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const moment = require('moment');

// add theatre
router.post("/add-theatre", authMiddleware, async (req, res) => {
  try {
    const newTheatre = new Theatre(req.body);
    await newTheatre.save();
    res.send({
      success: true,
      message: "Thêm rạp chiếu thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all theatres
router.get("/get-all-theatres", authMiddleware, async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Lấy dữ liệu tất cả rạp chiếu thành công!",
      data: theatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});


// update theatre
router.put("/update-theatre", authMiddleware, async (req, res) => {
  try {
    await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
    res.send({
      success: true,
      message: "Chỉnh sửa rạp chiếu thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete theatre
router.post("/delete-theatre", authMiddleware, async (req, res) => {
  try {
    const checkShow = await Show.find({theatre: req.body.theatreId})
    if (checkShow && checkShow.length > 0) return  res.send({
      success: false,
      message: "Tồn tại lịch chiếu trong rạp!",
    });
    await Theatre.findByIdAndDelete(req.body.theatreId);
    res.send({
      success: true,
      message: "Xóa rạp chiếu thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// add show
router.post("/add-show", authMiddleware, async (req, res) => {
  try {
    const { date, name, theatre } = req.body;
    const movieId = req.body.movie;
    const movie = await Movie.findById(movieId);
    const { time } = req.body;
    let timeParse = moment(time, "HH:mm");
    timeParse.add(movie.duration, "minutes");
    let endTime = timeParse.format("HH:mm");
    const newStartTime = moment(time, "HH:mm");
    const newEndTime = moment(endTime, "HH:mm");
    //verify Time
    const verifyTime = (start, end) => {
      const midnight = moment("00:00", "HH:mm");
      const eightAM = moment("08:00", "HH:mm");
      return (start.isBetween(midnight, eightAM, undefined, '()') || 
              end.isBetween(midnight, eightAM, undefined, '()') )
    }

    if (verifyTime(newStartTime, newEndTime)) {
      return res.send({
        success: false,
        message: "Thời gian chiếu nằm trong khoảng từ 8h đến 24h!",
      });
    }

    // Tìm kiếm các show có cùng date và name
    const existingShows = await Show.find({ date, name, theatre });
    // Kiểm tra xem có show nào trùng với time và endTime không
    const conflictingShow = existingShows.find(show => {
      const showStartTime = moment(show.time, "HH:mm");
      const showEndTime = moment(show.endTime, "HH:mm");

      // Kiểm tra xem newStartTime hoặc newEndTime nằm trong khoảng thời gian của show hiện tại
      return (
        (newStartTime.isSameOrAfter(showStartTime) && newStartTime.isSameOrBefore(showEndTime)) ||
        (newEndTime.isSameOrAfter(showStartTime) && newEndTime.isSameOrBefore(showEndTime)) || 
        (newStartTime.isSameOrBefore(showStartTime) && newEndTime.isSameOrAfter(showEndTime))
      );
    });

    if (conflictingShow) {
      return res.send({
        success: false,
        message: "Trùng lịch chiếu!",
      });
    }

    const newShow = new Show({
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      endTime: endTime,
      movie: req.body.movie,
      ticketPrice: req.body.ticketPrice,
      totalSeats: req.body.totalSeats,
      theatre: req.body.theatre
    });
    await newShow.save();
    res.send({
      success: true,
      message: "Thêm lịch chiếu thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all shows by theatre
router.post("/get-all-shows-by-theatre", authMiddleware, async (req, res) => {
  try {
    const shows = await Show.find({ theatre: req.body.theatreId })
      .populate("movie")
      .sort({
        createdAt: -1,
      });

    res.send({
      success: true,
      message: "Lấy dữ liệu lịch chiếu thành công!",
      data: shows,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete show
router.post("/delete-show", authMiddleware, async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: "Xóa lịch chiếu thành công!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique theatres which have shows of a movie
router.post("/get-all-theatres-by-movie", async (req, res) => {
  try {
    const { movie, date } = req.body;

    // find all shows of a movie
    const shows = await Show.find({ movie, date })
      .populate("theatre")
      .sort({ createdAt: -1 });
    // get all unique theatres
    let uniqueTheatres = [];
    shows.forEach((show) => {
      const theatre = uniqueTheatres.find(
        (theatre) => theatre._id == show.theatre._id
      );

      if (!theatre) {
        const showsForThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsForThisTheatre,
        });
      }
    });

    res.send({
      success: true,
      message: "Lấy rạp chiếu theo phim thành công",
      data: uniqueTheatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get show by id
router.post("/get-show-by-id", authMiddleware, async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId)
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      message: "Lấy thông tin lịch chiếu thành công",
      data: show,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
