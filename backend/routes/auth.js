const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middlewares/auth');

// Register user in MongoDB after Firebase signup
router.post('/register', requireAuth, async (req, res) => {
  try {
    const { email, name, firebaseId } = req.body;
    
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { firebaseId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          firebaseId
        }
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    if (!req.dbUser) return res.status(404).json({ error: 'User not found' });
    res.json(req.dbUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
