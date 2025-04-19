// server.js
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Router from './routes/index.js';
import {
  fetchFacebookData,
  fetchTwitterData,
  fetchInstagramData,
  fetchYouTubeData,
} from './utils/fetchdata.js';

// === Fix __dirname for ES Modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CREATE SERVER ===
const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE ===
app.use(cors());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// === STATIC FILES & VIEWS ===
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === ROUTES ===
Router(app); // Mount all routes from /routes/index.js

// === RENDER ADDITIONAL PAGES ===
app.get('/v1/login', (req, res) => {
  res.render('login',{ errors: []});
});

app.get('/v1/signup', (req, res) => {
  res.render("register",{ errors: []});
});

/*app.get('/v1/dashboard', async (req, res) => {
  try {
    const [facebook, twitter, instagram, youtube] = await Promise.allSettled([
      fetchFacebookData(),
      fetchTwitterData(),
      fetchInstagramData(),
      fetchYouTubeData(),
    ]);

    const dashboardData = {
      total_followers:
        (facebook.status === "fulfilled" ? facebook.value.followers : 0) +
        (twitter.status === "fulfilled" ? twitter.value.followers : 0) +
        (instagram.status === "fulfilled" ? instagram.value.followers : 0) +
        (youtube.status === "fulfilled" ? youtube.value.subscribers : 0),
      facebook: facebook.status === "fulfilled" ? facebook.value : {},
      twitter: twitter.status === "fulfilled" ? twitter.value : {},
      instagram: instagram.status === "fulfilled" ? instagram.value : {},
      youtube: youtube.status === "fulfilled" ? youtube.value : {},
    };

    res.render('index', { data: dashboardData });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
});*/

app.get('/v1/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Failed to logout.');
    res.redirect('/v1');
  });
});

// === CONNECT DATABASE & START SERVER ===
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error(err));
