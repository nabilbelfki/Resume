import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  dateTime: { type: Date, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  notes: { type: String, required: false },
  canceled: { type: Boolean, required: false }
});

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);

export default Meeting;
