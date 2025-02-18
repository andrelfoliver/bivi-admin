// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String }, // Só terá valor se o usuário usar Google OAuth
  email: { type: String, required: true },
  name: { type: String },
  username: { type: String },   // Para cadastro manual
  password: { type: String },   // Senha hash para cadastro manual
  provider: { type: String, required: true, default: 'google' } // 'google' ou 'local'
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
