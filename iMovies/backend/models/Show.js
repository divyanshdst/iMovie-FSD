const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
    },
    showDate: {
      type: Date,
      required: [true, 'Show date is required'],
    },
    showTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:45 PM", "09:30 PM"
      required: [true, 'Show time is required'],
    },
    ticketPrice: {
      standard: { type: Number, required: true, default: 200 },
      premium: { type: Number, default: 350 },
      vip: { type: Number, default: 500 },
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    bookedSeats: {
      type: [String], // Array of seat codes e.g. ["A1", "A2", "B4"]
      default: [],
    },
    heldSeats: [
      {
        seatNumber: String,
        userId: String,
        heldAt: { type: Date, default: Date.now },
      },
    ],
    screenNumber: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

showSchema.index({ movie: 1, theatre: 1, showDate: 1 });
showSchema.index({ showDate: 1, status: 1 });

module.exports = mongoose.model('Show', showSchema);

