import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Company from './models/Company.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Indica que o Express deve confiar no proxy (necessário para ambientes como o Heroku)
app.set('trust proxy', 1);

// Middleware para interpretar JSON e dados de formulário (urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conecta ao MongoDB utilizando a connection string definida na variável de ambiente
mongoose
  .connect(process.env.MONGO_URI_EMPRESAS)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Configura sessão para persistir dados de login
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true se estiver em produção (HTTPS)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
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
      callbackURL: "https://app.bivisualizer.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile.emails[0].value.endsWith('@gmail.com')) {
        return done(null, false, { message: 'Apenas contas Gmail são permitidas.' });
      }
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);
      // Cria um novo usuário incluindo a foto do perfil
      const newUser = await new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        provider: 'google'
      }).save();
      done(null, newUser);
    }
  )
);
// Endpoint para login com Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Login bem-sucedido: redireciona para a página principal
    res.redirect('/');
  }
);

// Endpoint para registro manual de usuário
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({ error: "Campos obrigatórios não preenchidos." });
  }
  const existingUser = await User.findOne({ email, provider: 'local' });
  if (existingUser) {
    return res.status(400).send({ error: "Usuário já existe." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name: name || username,
      provider: 'local'
    });
    const savedUser = await newUser.save();
    res.status(201).send({ message: "Usuário registrado com sucesso!", user: savedUser });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// Endpoint para login manual de usuário
app.post('/api/auth/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, provider: 'local' });
    if (!user) return res.status(401).send({ error: "Credenciais inválidas." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ error: "Credenciais inválidas." });
    req.login(user, (err) => {
      if (err) return next(err);
      res.send({ message: "Login efetuado com sucesso!", user });
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// Endpoint para verificar se o usuário está autenticado
app.get('/api/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Endpoint para cadastro de empresas
app.post('/register-company', async (req, res) => {
  console.log("Requisição recebida em /register-company:", req.body);
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    console.log("Empresa cadastrada:", savedCompany);
    res.status(201).send({ message: "Empresa cadastrada com sucesso!", company: savedCompany });
  } catch (err) {
    console.error("Erro ao cadastrar empresa:", err);
    res.status(500).send({ error: "Erro ao cadastrar empresa: " + err.message });
  }
});

// Rota protegida para servir o frontend (página de configuração da empresa)
app.get('/company-registration', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota curinga para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
