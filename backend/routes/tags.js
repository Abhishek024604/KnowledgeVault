const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
