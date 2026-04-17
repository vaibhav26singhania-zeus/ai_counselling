import jwt from 'jsonwebtoken';
import { userDB } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d'; // 30 days instead of 7

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired:', error.message);
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token:', error.message);
    }
    return null;
  }
}

// Middleware to authenticate requests
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token. Please login again.' });
  }

  req.user = decoded;
  next();
}

// Register new user
export async function register(email, password, name) {
  try {
    const user = await userDB.createUser(email, password, name);
    const token = generateToken(user);
    return { user, token };
  } catch (error) {
    throw error;
  }
}

// Login user
export async function login(email, password) {
  const user = userDB.findByEmail(email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await userDB.verifyPassword(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  return { user: userWithoutPassword, token };
}
