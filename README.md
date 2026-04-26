# AI Counselling Chatbot 🤖

A mobile-first financial advisory chatbot powered by local Qwen 3.5:1b LLM with voice input and output capabilities.

## Features

- 💬 Chat with AI financial advisor (ArthBot)
- 🧠 RAG (Retrieval-Augmented Generation) for accurate financial advice
- 🎤 Voice input (Speech-to-Text)
- 🔊 Voice output (Text-to-Speech)
- 🌐 Bilingual support (Hindi & English)
- 📚 Curated financial knowledge base
- 📱 Mobile-optimized UI
- 🏠 Dashboard with financial insights
- 🎯 Goals tracking
- 💰 Savings management
- 📊 Quiz module

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Web Speech API

### Backend
- Node.js + Express
- Ollama (Local LLM runtime)
- llama3.5:1b model
- RAG system with financial knowledge base

## Quick Start

### Prerequisites
1. Node.js v18+
2. Ollama installed

### Installation

```bash
# 1. Install Ollama
# Windows: Download from https://ollama.com/download/windows
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull llama model
ollama pull llama3.5:1b

# 3. Install dependencies
npm install
cd server && npm install && cd ..

# 4. Start both servers (Windows)
start.bat

# Or manually:
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
npm run dev
```

### Access the App
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Demo Login
- Email: `user@example.com`
- Password: `password123`

## Voice Features

### Voice Input 🎤
- Click the microphone button to speak
- Supports Hindi and English
- Requires Chrome/Edge browser

### Voice Output 🔊
- Toggle speaker icon in header for auto-speak
- Click speaker on any message to hear it
- Automatic language detection

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── context/        # Auth context
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks (useSpeech)
│   └── assets/         # Images
├── server/
│   ├── server.js       # Express server
│   ├── test-ollama.js  # Connection test
│   └── package.json
└── public/             # Static assets
```

## Configuration

### Backend (.env in server/)
```env
PORT=4000
OLLAMA_API=http://localhost:11434
MODEL_NAME=llama3.5:1b
```

### Frontend (.env in root)
```env
VITE_API_BASE_URL=http://localhost:4000
```

## Customization

### Change LLM Model
Edit `server/server.js`:
```javascript
const MODEL_NAME = 'llama3.5:3b'; // Use larger model
```

### Adjust AI Behavior
Modify temperature and other parameters in `server/server.js`:
```javascript
options: {
  temperature: 0.7,  // 0-1 (higher = more creative)
  top_p: 0.9,
  num_predict: 256,  // Max response length
}
```

### Change Voice Language
Edit `src/components/VoiceInput.jsx` and `src/hooks/useSpeech.js`

## Testing

```bash
# Test Ollama connection
cd server
npm test

# Test RAG system
npm run test:rag
```

## Troubleshooting

See [SETUP.md](SETUP.md) for detailed troubleshooting guide.

Common issues:
- **Ollama not running**: Run `ollama serve`
- **Model not found**: Run `ollama pull llama3.5:1b`
- **Voice not working**: Use Chrome/Edge, allow microphone permissions

## License

MIT

## Credits

Built with React + Vite
Powered by Ollama and llama LLM
