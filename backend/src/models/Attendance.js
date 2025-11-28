const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE'],
      required: true,
    },
    remarks: String,
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

