// /models/Experience.js
import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  zIndex: { type: Number, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  logo: {
    opened: {
      name: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    closed: {
      name: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    }
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  period: {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date }
  },
  color: {
    line: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    type: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    background: { type: String, required: true },
    details: { type: String, required: true },
    description: {
      text: { type: String, required: true },
      background: { type: String, required: true }
    }
  },
  description: { type: String, required: true }
}, { collection: 'experience' });

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
