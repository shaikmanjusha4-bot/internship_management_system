const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an internship title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location (e.g. Remote, City)'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Please provide internship duration (e.g. 3 Months)'],
      trim: true,
    },
    stipend: {
      type: String,
      required: [true, 'Please provide stipend amount or Unpaid'],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please provide at least one required skill'],
      default: [],
    },
    eligibility: {
      type: String,
      default: 'Open to all students and recent graduates',
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Please provide an application deadline'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Internship', internshipSchema);
