import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
import Company from './models/Company.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Conecta ao MongoDB utilizando a connection string definida na variável de ambiente MONGO_URI_EMPRESAS
mongoose
  .connect(process.env.MONGO_URI_EMPRESAS)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Configura sessão para persistir dados de login
app.use(
  session({
    secret: 'seu-segredo-de-sessao',
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializa o Passport e a sessão
app.use(passport.initialize());
app.use(passport.session());

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

// Configura a estratégia do Google OAuth (permitindo apenas contas Gmail)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Verifica se o e‑mail é do Gmail
      if (!profile.emails[0].value.endsWith('@gmail.com')) {
        return done(null, false, { message: 'Apenas contas Gmail são permitidas.' });
      }

      // Procura se o usuário já existe
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);

      // Cria um novo usuário se não existir
      const newUser = await new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      }).save();

      done(null, newUser);
    }
  )
);

// Rota para iniciar a autenticação com o Google
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback após autenticação com o Google
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Login bem-sucedido, redireciona para a página de cadastro da empresa.
    res.redirect('/company-registration');
  }
);

// Rota protegida para cadastro da empresa (acesso apenas para usuários autenticados)
app.get('/company-registration', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  // Aqui você pode renderizar sua página de cadastro (por exemplo, enviar um HTML ou renderizar seu app React)
  res.send('Página de cadastro da empresa');
});

// Servir arquivos estáticos (por exemplo, a página de login)
app.use(express.static('public'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para cadastrar a empresa com todos os inputs recebidos via JSON
app.post('/register-company', async (req, res) => {
  try {
    const companyData = req.body; // Espera receber um objeto JSON com todos os campos
    const newCompany = new Company(companyData);
    await newCompany.save();
    res.status(201).send({ message: "Empresa cadastrada com sucesso!", company: newCompany });
  } catch (err) {
    res.status(500).send({ error: "Erro ao cadastrar empresa: " + err.message });
  }
});

// Rota de teste para inserir um documento simples na coleção Company
// Por fim, qualquer rota que não seja de API deve retornar o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
