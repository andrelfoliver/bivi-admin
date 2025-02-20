import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    username: { type: String }, // Para login manual
    email: { type: String, required: true },
    password: { type: String }, // Apenas para usuários manuais
    name: { type: String },
    picture: { type: String }, // Para usuários do Google
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
