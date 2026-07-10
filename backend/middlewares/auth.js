const { getAuth } = require('firebase-admin/auth');
const prisma = require('../lib/prisma');

// Ensure firebase admin is initialized in server.js before this middleware is used
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    
    // Auto-sync user to MongoDB if they don't exist (important for users created before DB was hooked up)
    let mongoUser = await prisma.user.findUnique({ where: { firebaseId: decodedToken.uid } });
    if (!mongoUser) {
      mongoUser = await prisma.user.create({
        data: {
          firebaseId: decodedToken.uid,
          email: decodedToken.email || 'unknown@example.com',
          name: decodedToken.name || 'User'
        }
      });
    }
    
    req.dbUser = mongoUser;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
}

module.exports = { requireAuth };
