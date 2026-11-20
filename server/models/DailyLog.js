const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  date: { type: Date, required: true },
  hours: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);