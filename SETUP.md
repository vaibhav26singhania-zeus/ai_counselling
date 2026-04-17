# AI Counselling Chatbot Setup Guide

This guide will help you set up the chatbot with your local Qwen 3.5:1b model.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** - For running the Qwen model locally

## Step 1: Install Ollama

### Windows
Download and install from: https://ollama.com/download/windows

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## Step 2: Pull the Qwen Model

After installing Ollama, pull the Qwen 3.5 1B model:

```bash
ollama pull qwen3.5:1b
```

You can also try other Qwen variants:
```bash
ollama pull qwen2.5:0.5b  # Smaller, faster
ollama pull qwen2.5:3b    # Larger, more capable
ollama pull qwen3.5:3b    # Qwen 3.5 larger variant
```

## Step 3: Start Ollama Server

Ollama should start automatically after installation. If not:

```bash
ollama serve
```

This will start the Ollama API server on `http://localhost:11434`

## Step 4: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd server
npm install
```

## Step 5: Configure Environment

Create a `.env` file in the root directory (optional):

```env
VITE_API_BASE_URL=http://localhost:4000
```

Create a `.env` file in the `server` directory (optional):

```env
PORT=4000
OLLAMA_API=http://localhost:11434
MODEL_NAME=qwen3.5:1b
```

## Step 6: Start the Application

### Terminal 1 - Start Backend Server
```bash
cd server
npm start
```

### Terminal 2 - Start Frontend
```bash
npm run dev
```

## Step 7: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Voice Features

### Voice Input
- Click the 🎤 Voice button to speak your question
- Supports Hindi and English
- Browser must support Web Speech API (Chrome, Edge recommended)

### Voice Output
- Toggle speaker icon (🔊/🔇) in header to enable/disable auto-speak
- Click speaker icon on any message to hear it read aloud
- Supports Hindi and English text-to-speech

## Testing the Setup

1. Login with demo credentials:
   - Email: `user@example.com`
   - Password: `password123`

2. Navigate to Chat page

3. Try asking:
   - "What is SIP?"
   - "How to save money?"
   - "बचत कैसे करें?"

## Troubleshooting

### Ollama Connection Issues
- Verify Ollama is running: `ollama list`
- Check if model is downloaded: `ollama list` (should show qwen3.5:1b)
- Pull model if missing: `ollama pull qwen3.5:1b`
- Test API: `curl http://localhost:11434/api/tags`

### Voice Input Not Working
- Use Chrome or Edge browser
- Allow microphone permissions
- Check browser console for errors

### Voice Output Not Working
- Check browser supports Speech Synthesis API
- Verify audio is not muted
- Try different browsers

## Customization

### Change Model
Edit `server/server.js`:
```javascript
const MODEL_NAME = 'qwen2.5:3b'; // Use different model
```

### Adjust Model Parameters
Edit the Ollama API call in `server/server.js`:
```javascript
options: {
  temperature: 0.7,  // Creativity (0-1)
  top_p: 0.9,        // Diversity (0-1)
  num_predict: 256,  // Max response length
}
```

### Change Voice Language
Edit `src/components/VoiceInput.jsx`:
```javascript
recognition.lang = 'en-US' // or 'hi-IN' for Hindi
```

Edit `src/hooks/useSpeech.js`:
```javascript
const speak = useCallback((text, lang = 'en-US') => {
  // Change default language
}, [])
```

## Production Deployment

For production, you'll need to:
1. Set up proper authentication
2. Use environment variables for configuration
3. Deploy backend to a server (Heroku, Railway, etc.)
4. Deploy frontend to hosting (Vercel, Netlify, etc.)
5. Consider using a cloud-based LLM API for better scalability

## Support

For issues with:
- Ollama: https://github.com/ollama/ollama
- Qwen models: https://github.com/QwenLM/Qwen
