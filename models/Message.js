import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: false },
    created: { type: Date, unique: true, required: true },
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;
