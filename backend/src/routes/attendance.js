const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const router = express.Router();

router.post('/bulk', async (req, res, next) => {
  try {
    const { date, batch, records = [] } = req.body;
    if (!date || !batch) {
      return res.status(400).json({ message: 'date and batch are required' });
    }
    const targetDate = new Date(date);

    const ops = records.map((record) => ({
      updateOne: {
        filter: { date: targetDate, student: record.student },
        update: {
          date: targetDate,
          batch,
          student: record.student,
          status: record.status,
          remarks: record.remarks,
        },
        upsert: true,
      },
    }));

    if (ops.length === 0) {
      return res.status(400).json({ message: 'No records provided' });
    }

    await Attendance.bulkWrite(ops);
    res.status(200).json({ message: 'Attendance saved' });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { date, batch } = req.query;
    if (!date || !batch) {
      return res.status(400).json({ message: 'date and batch query params required' });
    }

    const students = await Student.find({ batch }).sort({ rollNumber: 1 });
    const attendance = await Attendance.find({ batch, date: new Date(date) });
    const map = attendance.reduce((acc, record) => {
      acc[record.student.toString()] = record;
      return acc;
    }, {});

    const merged = students.map((student) => ({
      student,
      status: map[student._id]?.status || 'ABSENT',
      attendanceId: map[student._id]?._id,
      remarks: map[student._id]?.remarks,
    }));

    res.json(merged);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

