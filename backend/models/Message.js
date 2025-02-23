import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    destinatario: { type: String },
    message: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String },
    email: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
export { messageSchema };
export default Message;
