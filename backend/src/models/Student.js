const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    guardianName: String,
    guardianContact: String,
    notes: String,
  },
  { timestamps: true }
);

studentSchema.index({ rollNumber: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);

