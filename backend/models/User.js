// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String },
  picture: { type: String } // novo campo para armazenar a URL do avatar
});

const User = mongoose.model('User', userSchema);
export default User;
