const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner (the FK in your SQL schema)
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['skill', 'interest'], default: 'skill' },       // one table for both
  category: { type: String, enum: ['technical', 'soft', 'domain'], default: 'technical' },
  level: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], default: 'Basic' },
  desiredHoursPerWeek: { type: Number, default: 0, min: 0 }                    // used for the interest gap
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);