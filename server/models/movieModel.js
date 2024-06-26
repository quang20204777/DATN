const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    producer: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    nation: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    coverPoster: {
      type: String,
      required: true,
    },
    cast: {
      type: String,
    },
    crew: {
      type: String,
    },
    age: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("movies", movieSchema);
