# Backend Server for AI Counselling Chatbot

Express server that connects your frontend to the local Qwen LLM via Ollama.

## Quick Start

```bash
# Install dependencies
npm install

# Test Ollama connection
npm test

# Start server
npm start
```

## Endpoints

- `POST /auth/login` - Mock authentication
- `POST /chat` - Send message to Qwen model
- `GET /dashboard` - Get dashboard data

## Configuration

Set environment variables in `.env`:

```env
PORT=4000
OLLAMA_API=http://localhost:11434
MODEL_NAME=qwen3.5:1b
```
