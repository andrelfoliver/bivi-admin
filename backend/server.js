import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import MongoStore from 'connect-mongo';

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

// Indica que o Express deve confiar no proxy (necessário para Heroku)
app.set('trust proxy', 1);

// Middleware para interpretar JSON e dados de formulário (urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conecta ao MongoDB utilizando a connection string definida na variável de ambiente
mongoose
  .connect(process.env.MONGO_URI_EMPRESAS)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Configura sessão para persistir dados de login com cookies seguros
app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI_EMPRESAS }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,     // pois está em produção/HTTPS
    sameSite: 'none', // fluxo OAuth cross-site
    // NÃO defina 'domain', deixe o Express gerir
  }
}));


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
// No seu server.js (ou arquivo onde a GoogleStrategy está configurada)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://bivi-empresas-28885d192e15.herokuapp.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      // Extraia a URL da foto
      const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

      // Verifica se o e‑mail é do Gmail
      if (!profile.emails[0].value.endsWith('@gmail.com')) {
        return done(null, false, { message: 'Apenas contas Gmail são permitidas.' });
      }

      // Procura se o usuário já existe
      let existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // Atualiza o campo 'picture' se necessário
        if (picture && existingUser.picture !== picture) {
          existingUser.picture = picture;
          await existingUser.save();
        }
        return done(null, existingUser);
      }

      // Cria um novo usuário se não existir
      const newUser = await new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture, // salva a URL da foto
      }).save();

      done(null, newUser);
    }
  )
);


// Rota para iniciar a autenticação com o Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback após autenticação com o Google
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Login bem-sucedido: redireciona para a rota principal (onde o frontend decide)
    res.redirect('/');
  }
);

// Rota protegida para cadastro da empresa (o frontend gerencia a exibição com base na sessão)
app.get('/company-registration', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para cadastrar a empresa com os dados enviados via JSON ou formulário
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

// Rota para verificar se o usuário está autenticado
app.get('/api/current-user', (req, res) => {
  console.log('--- /api/current-user LOGS ---');
  console.log('req.headers.cookie:', req.headers.cookie);
  console.log('req.sessionID:', req.sessionID);
  console.log('req.session:', req.session);
  console.log('req.user:', req.user);
  console.log('req.isAuthenticated():', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});



// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota curinga para SPA: para qualquer rota que não seja de API, retorna o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
