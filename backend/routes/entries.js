const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middlewares/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const cheerio = require('cheerio');

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all entries, optionally filtered by topic
router.get('/', requireAuth, async (req, res) => {
  try {
    const { topicId } = req.query;
    const user = req.dbUser;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const query = {
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { tags: true, topic: true }
    };
    
    if (topicId) {
      query.where = { ...query.where, topicId };
    }
    
    const entries = await prisma.entry.findMany(query);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single entry
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.dbUser;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const entry = await prisma.entry.findFirst({
      where: { id, userId: user.id },
      include: { tags: true, topic: true }
    });
    
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an entry
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reflection } = req.body;
    
    const user = req.dbUser;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedEntry = await prisma.entry.updateMany({
      where: { id, userId: user.id },
      data: { reflection }
    });

    if (updatedEntry.count === 0) return res.status(404).json({ error: 'Entry not found' });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an entry
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.dbUser;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const entry = await prisma.entry.findFirst({
      where: { id, userId: user.id }
    });

    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    await prisma.entry.delete({ where: { id } });

    await prisma.topic.update({
      where: { id: entry.topicId },
      data: { entryCount: { decrement: 1 }, updatedAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function callOpenRouter(prompt) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('...')) return null;
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openrouter/free",
      messages: [
        { role: "system", content: "You are a precise data extractor. You must output ONLY a valid JSON object. Do not include markdown formatting or extra text." },
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);
    return null;
  }
}

// Create a new entry
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { type, topicId } = req.body;
    let title = req.body.title || 'Untitled';
    let url = req.body.url || null;
    let content = req.body.content || null;
    
    const user = req.dbUser;
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userId = user.id;
    
    let coverImage = null;
    let summary = null;
    let fileUrl = null;
    let fileName = req.body.fileName || null;
    let tagsList = [];

    // 1. Process File Upload
    if (type === 'File' && req.file) {
      fileName = req.file.originalname;
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { resource_type: 'auto' });
      fileUrl = uploadRes.secure_url;
      title = fileName;
    }

    // 2. Scrape Link Metadata
    if (type === 'Link' && url) {
      try {
        let fetchUrl = url;
        if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
          fetchUrl = 'https://' + fetchUrl;
          url = fetchUrl; // Save the corrected url
        }

        // Normalize YouTube links to bypass Microlink cache misses on unique tracking IDs
        try {
          const parsed = new URL(fetchUrl);
          if (parsed.hostname === 'youtu.be') {
            const videoId = parsed.pathname.slice(1);
            fetchUrl = `https://www.youtube.com/watch?v=${videoId}`;
          } else if (parsed.hostname.includes('youtube.com')) {
            parsed.searchParams.delete('si');
            fetchUrl = parsed.toString();
          }
        } catch(e) {}

        const microlinkRes = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(fetchUrl)}`, { timeout: 60000 });
        if (microlinkRes.data?.data) {
          const { title: mTitle, image: mImage } = microlinkRes.data.data;
          if (mTitle) title = mTitle;
          if (mImage?.url) coverImage = mImage.url;
        }
      } catch (err) {
        console.error("Scraping error:", err.message);
      }
    }

    // 3. AI Processing (OpenRouter)
    if (type === 'Link') {
      const textToAnalyze = `Title: ${title}\nURL: ${url}`;
      const aiResponse = await callOpenRouter(`Analyze the following content and provide a JSON response with exactly two keys: "summary" (a 2-sentence summary) and "tags" (an array of 3-5 lowercase relevant topic tags).\n\nContent: ${textToAnalyze}`);
      
      if (aiResponse) {
        try {
          const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          summary = parsed.summary;
          tagsList = parsed.tags || [];
        } catch (e) {
          console.error("Failed to parse AI JSON", e);
        }
      }
    }

    // 4. Create tags in DB
    const tagConnections = [];
    for (const tagName of tagsList) {
      let tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName } });
      }
      tagConnections.push({ id: tag.id });
    }

    // 5. Save to DB
    const entry = await prisma.entry.create({
      data: {
        type,
        title,
        url,
        content,
        summary,
        coverImage,
        fileName,
        fileUrl,
        topicId,
        userId,
        tags: { connect: tagConnections }
      },
      include: { tags: true }
    });

    await prisma.topic.update({
      where: { id: topicId },
      data: { entryCount: { increment: 1 }, updatedAt: new Date() }
    });

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
