const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Theatre address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    screens: {
      type: Number,
      default: 1,
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    amenities: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

theatreSchema.index({ city: 1, isActive: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);

