const express = require('express');
const Batch = require('../models/Batch');
const Student = require('../models/Student');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const students = await Student.countDocuments({ batch: req.params.id });
    if (students > 0) {
      return res.status(400).json({
        message: 'Cannot delete batch with enrolled students',
      });
    }
    await Batch.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

