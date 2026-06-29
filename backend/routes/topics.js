const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { requireAuth } = require('../middlewares/auth');

// Get all topics for a user
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: req.user.uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const topics = await prisma.topic.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new topic
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const user = await prisma.user.findUnique({ where: { firebaseId: req.user.uid } });
    
    const topic = await prisma.topic.create({
      data: { name, icon, color, userId: user.id }
    });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a topic and all its entries
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { firebaseId: req.user.uid } });
    
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic || topic.userId !== user.id) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Delete all entries associated with this topic
    await prisma.entry.deleteMany({ where: { topicId: id } });
    
    // Delete the topic itself
    await prisma.topic.delete({ where: { id } });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
