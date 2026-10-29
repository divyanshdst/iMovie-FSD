const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  photo: { type: String, default: '' },
});

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie synopsis / description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    language: {
      type: String,
      required: [true, 'Movie language is required'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Movie duration in minutes is required'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    poster: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    cast: [castSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for fast searching and filtering
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1, language: 1, releaseDate: -1 });

module.exports = mongoose.model('Movie', movieSchema);

