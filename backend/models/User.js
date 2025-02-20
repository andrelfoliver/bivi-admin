import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    username: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    name: { type: String },
    company: { type: String }, // novo campo
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
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
