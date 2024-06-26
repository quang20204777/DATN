const mongoose = require("mongoose");
const moment = require('moment')

const bookingSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shows",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    seats: {
      type: Array,
      required: true,
    },
    totalPrice: { 
      type: Number,
      required: true,
    },
    statusCheckin: {
      type: Number,
      default: 0
    },
    transactionId: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function(next) {
  try {
    const Show = mongoose.model('shows');
    const show = await Show.findOne({ _id: this.show });
    if (moment(show.date).isBefore(moment().startOf('day')) || 
        (moment(show.date).isSame(moment(), 'day') && moment(show.endTime, 'HH:mm').isBefore(moment(), 'hour'))) {
      this.statusCheckin = -1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("bookings", bookingSchema);