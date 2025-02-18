import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    googleId: { type: String },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String },
    provider: { type: String, required: true } // "google" ou "local"
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
