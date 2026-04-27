import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { performRAG } from './rag.js';
import { performEnhancedRAG } from './rag-enhanced.js';
import { authenticateToken, register, login, generateToken } from './auth.js';
import { userDB } from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Ollama API endpoint (default local installation)
const OLLAMA_API = process.env.OLLAMA_API || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3.2:1b'; // Change to 'llama3.2:1b' if qwen not available

app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await register(email, password, name);
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

// Get user profile
app.get('/auth/profile', authenticateToken, (req, res) => {
  const user = userDB.findById(req.user.id);
  const preferences = userDB.getPreferences(req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    preferences
  });
});

// Refresh token endpoint
app.post('/auth/refresh', authenticateToken, (req, res) => {
  try {
    const user = userDB.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate new token
    const newToken = generateToken({ id: user.id, email: user.email });
    
    res.json({
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Update user preferences
app.put('/auth/preferences', authenticateToken, (req, res) => {
  try {
    const { language, auto_speak } = req.body;
    userDB.updatePreferences(req.user.id, { language, auto_speak });
    
    const preferences = userDB.getPreferences(req.user.id);
    res.json({ preferences });
  } catch (error) {
    console.error('Preferences update error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Chat endpoint with RAG-enhanced Qwen model
app.post('/chat', authenticateToken, async (req, res) => {
  console.log('📨 Received chat request');
  console.log('Body:', req.body);
  console.log('Auth header:', req.headers.authorization);
  
  try {
    const { message, language = 'hi' } = req.body;
    
    if (!message) {
      console.log('❌ No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 Calling Ollama with model:', MODEL_NAME);
    console.log('🌐 Language:', language);
    
    // Perform RAG: retrieve relevant context from knowledge base
    console.log('🔍 Performing RAG retrieval...');
    
    // Check if extended knowledge base exists
    const extendedKBPath = path.join(__dirname, 'knowledge-base-extended.json');
    const useEnhancedRAG = fs.existsSync(extendedKBPath);
    
    const ragResult = useEnhancedRAG 
      ? performEnhancedRAG(message, language, 5)
      : performRAG(message, language);
    
    const { context, retrievedDocs, hasContext } = ragResult;
    
    if (hasContext) {
      console.log(`✅ Retrieved ${retrievedDocs.length} relevant documents`);
      console.log('Topics:', retrievedDocs.map(d => d.topic || d.id).join(', '));
      if (useEnhancedRAG) {
        console.log('📚 Using enhanced RAG with large knowledge base');
      }
    } else {
      console.log('ℹ️ No specific context found, using general knowledge');
    }
    
    // System prompt for financial advisor with language preference
    const systemPrompt = language === 'hi' 
      ? `आप ArthBot हैं, एक सहायक AI वित्तीय सलाहकार। आप बचत, निवेश, ऋण और वित्तीय योजना पर सलाह देते हैं। हिंदी में जवाब दें।

महत्वपूर्ण: अपने जवाब को अच्छी तरह से फॉर्मेट करें:
- मुख्य विषयों के लिए ## का उपयोग करें
- उप-विषयों के लिए ### का उपयोग करें
- महत्वपूर्ण बिंदुओं को **बोल्ड** करें
- सूचियों के लिए - या 1. का उपयोग करें
- संक्षिप्त और सहायक जवाब दें`
      : `You are ArthBot, a helpful AI financial advisor. You provide advice on savings, investments, loans, and financial planning. Respond in English.

Important: Format your responses well:
- Use ## for main topics
- Use ### for subtopics
- Make important points **bold**
- Use - or 1. for lists
- Keep responses concise and helpful`;

    // Build the full prompt with RAG context
    const fullPrompt = hasContext 
      ? `${systemPrompt}\n\n${context}\nUser: ${message}\nAssistant:`
      : `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    // Call Ollama API
    const response = await axios.post(`${OLLAMA_API}/api/generate`, {
      model: MODEL_NAME,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 300,
      }
    });

    const answer = response.data.response.trim();
    console.log('✅ Got response from Ollama');
    
    res.json({ 
      answer,
      model: MODEL_NAME,
      language,
      rag_used: hasContext,
      sources: hasContext ? retrievedDocs.map(d => d.topic || d.id) : [],
      enhanced_rag: useEnhancedRAG
    });
  } catch (error) {
    console.error('❌ Error calling Ollama:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(500).json({ 
      error: 'Failed to get response from AI model',
      details: error.message
    });
  }
});

// Dashboard endpoint
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    savings: 50000,
    goals: 3,
    investments: 25000
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using Ollama at ${OLLAMA_API}`);
  console.log(`Model: ${MODEL_NAME}`);
});
