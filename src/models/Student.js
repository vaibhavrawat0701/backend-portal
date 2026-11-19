const mongoose = require('mongoose');

const AVAILABLE_CLUBS = ['Coding Club', 'Robotics Club', 'Cultural Club', 'Sports Club'];

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    preferredClub: {
      type: String,
      required: true,
      enum: AVAILABLE_CLUBS,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student, AVAILABLE_CLUBS };
