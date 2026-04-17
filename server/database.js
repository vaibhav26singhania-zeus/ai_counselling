import fs from 'fs';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'users.json');

// Initialize database file
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], preferences: [] }, null, 2));
    console.log('✅ Database file created');
  } else {
    console.log('✅ Database file loaded');
  }
}

// Read database
function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write database
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

initDB();

// User operations
export const userDB = {
  // Create new user
  async createUser(email, password, name = null) {
    try {
      const db = readDB();
      
      // Check if user exists
      if (db.users.find(u => u.email === email)) {
        throw new Error('Email already exists');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: db.users.length + 1,
        email,
        password: hashedPassword,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      db.users.push(newUser);
      
      // Create default preferences
      db.preferences.push({
        id: db.preferences.length + 1,
        user_id: newUser.id,
        language: 'hi',
        auto_speak: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      writeDB(db);
      
      return { id: newUser.id, email, name };
    } catch (error) {
      throw error;
    }
  },

  // Find user by email
  findByEmail(email) {
    const db = readDB();
    return db.users.find(u => u.email === email);
  },

  // Find user by ID
  findById(id) {
    const db = readDB();
    const user = db.users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Get user preferences
  getPreferences(userId) {
    const db = readDB();
    return db.preferences.find(p => p.user_id === userId);
  },

  // Update user preferences
  updatePreferences(userId, preferences) {
    const db = readDB();
    const prefIndex = db.preferences.findIndex(p => p.user_id === userId);
    
    if (prefIndex !== -1) {
      if (preferences.language !== undefined) {
        db.preferences[prefIndex].language = preferences.language;
      }
      if (preferences.auto_speak !== undefined) {
        db.preferences[prefIndex].auto_speak = preferences.auto_speak;
      }
      db.preferences[prefIndex].updated_at = new Date().toISOString();
      
      writeDB(db);
      return db.preferences[prefIndex];
    }
    return null;
  }
};

export default { userDB };
