const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    seats: {
      type: [String], // e.g. ["B3", "B4"]
      required: [true, 'At least one seat must be selected'],
    },
    seatType: {
      type: String,
      enum: ['standard', 'premium', 'vip'],
      default: 'standard',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate human-friendly booking code
bookingSchema.pre('save', function (next) {
  if (!this.bookingCode) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingCode = `IMV-${Date.now().toString().slice(-6)}-${randomHex}`;
  }
  next();
});

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

