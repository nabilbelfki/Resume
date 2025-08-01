// models/Media.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  fileSize: { type: Number, required: true },
  created: { type: Date, default: Date.now },
  description: { type: String, default: '' },
  fileType: { type: String, required: true },
  extension: { type: String, required: true },
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  lastModified: { type: Date },
  metadata: { type: Object }
}, {
  timestamps: true
});

module.exports = mongoose.models.Media || mongoose.model('Media', MediaSchema);