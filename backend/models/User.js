import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    username: { type: String },
    email: { type: String, required: true },
    password: { type: String }, // Apenas para usuários manuais
    name: { type: String },
    picture: { type: String }, // Campo adicionado para armazenar a URL do avatar
    provider: { 
      type: String, 
      required: true, 
      enum: ['google', 'local'] // "google" para login via Google e "local" para cadastro manual
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
