const express = require('express');
const DailyLog = require('../models/DailyLog');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {              // list my logs
  try {
    const logs = await DailyLog.find({ user: req.userId })
      .populate('skill', 'name type')               // swap the skill id for its name
      .sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {             // add a log
  try {
    const { skill, date, hours } = req.body;
    if (!skill || hours === undefined) {
      return res.status(400).json({ message: 'Skill and hours required' });
    }
    const owned = await Skill.findOne({ _id: skill, user: req.userId }); // skill must be mine
    if (!owned) return res.status(404).json({ message: 'Skill not found' });
    const log = await DailyLog.create({
      user: req.userId, skill, date: date || new Date(), hours
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {       // delete a log
  try {
    const log = await DailyLog.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!log) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;