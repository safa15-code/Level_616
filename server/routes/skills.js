const express = require('express');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);                                   // every route below needs a valid token

router.get('/', async (req, res) => {              // list my skills
  try {
    const skills = await Skill.find({ user: req.userId }).sort({ createdAt: -1 }); // newest first
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {             // add a skill
  try {
    const { name, type, category, level, desiredHoursPerWeek } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const skill = await Skill.create({
      user: req.userId, name, type, category, level, desiredHoursPerWeek
    });
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message }); // e.g. invalid level value
  }
});

router.put('/:id', async (req, res) => {           // edit
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },     // must be mine
      req.body,
      { new: true, runValidators: true }            // return updated doc, enforce enums
    );
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {        // delete
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;