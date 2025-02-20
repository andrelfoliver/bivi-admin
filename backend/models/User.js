import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true }, // Agora é único
    password: { type: String },
    name: { type: String },
    picture: { type: String },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'local']
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client'
    },
    company: { type: String }, // Incluindo empresa caso não esteja no schema
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
