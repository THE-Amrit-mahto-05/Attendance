const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const router = express.Router();

router.get('/student/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await Attendance.find({ student: id })
      .sort({ date: -1 })
      .lean();
    const total = history.length;
    const presents = history.filter((r) => r.status === 'PRESENT').length;
    const percentage = total ? Math.round((presents / total) * 100) : 0;

    res.json({
      stats: {
        total,
        presents,
        absents: history.filter((r) => r.status === 'ABSENT').length,
        lates: history.filter((r) => r.status === 'LATE').length,
        percentage,
      },
      history,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/batch-summary', async (req, res, next) => {
  try {
    const { date, batch } = req.query;
    if (!date || !batch) {
      return res.status(400).json({ message: 'date and batch are required' });
    }
    const dayRecords = await Attendance.find({ batch, date: new Date(date) });
    const summary = dayRecords.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { PRESENT: 0, ABSENT: 0, LATE: 0 }
    );

    res.json(summary);
  } catch (err) {
    next(err);
  }
});

router.get('/defaulters', async (req, res, next) => {
  try {
    const {
      batch,
      month,
      year,
      threshold = 75,
    } = req.query;
    if (!batch || !month || !year) {
      return res.status(400).json({ message: 'batch, month, and year are required' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const students = await Student.find({ batch });
    const attendance = await Attendance.find({
      batch,
      date: { $gte: start, $lte: end },
    }).lean();

    const grouped = attendance.reduce((acc, record) => {
      const key = record.student.toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {});

    const result = students
      .map((student) => {
        const records = grouped[student._id.toString()] || [];
        const total = records.length;
        const presents = records.filter((r) => r.status === 'PRESENT').length;
        const percentage = total ? Math.round((presents / total) * 100) : 0;
        return {
          student,
          percentage,
        };
      })
      .filter((entry) => entry.percentage < threshold);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

