require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK
if (process.env.FIREBASE_PROJECT_ID) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Knoledge API is running');
});

// Import and use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/tags', require('./routes/tags'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
