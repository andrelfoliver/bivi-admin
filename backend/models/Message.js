// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    destinatario: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    email: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Cria o modelo "Message" usando o schema definido
const Message = mongoose.model('Message', messageSchema);

export default Message;
