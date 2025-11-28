const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { batch } = req.query;
    const criteria = batch ? { batch } : {};
    const students = await Student.find(criteria)
      .populate('batch', 'name')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('batch', 'name');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

