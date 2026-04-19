# Chat History Guide

## Overview

Chat history is now automatically saved and persists across page changes, app restarts, and browser sessions!

## Features

### ✅ Automatic Saving
- Messages saved to browser localStorage
- Saves after every message
- No manual action needed
- Works offline

### ✅ Persistent Across
- Page navigation (Dashboard → Chat → Goals → Chat)
- Browser refresh (F5)
- App restarts
- Browser close/reopen
- Device restarts

### ✅ Per-User Storage
- Each user has their own chat history
- History tied to user ID
- Switching accounts shows different history
- Secure and private

### ✅ Clear History Button
- 🗑️ Trash icon in chat header
- Confirmation dialog before deleting
- Cannot be undone
- Resets to welcome message

## How It Works

### Storage Location

**Browser localStorage:**
```
Key: arthbot_chat_history_<user_id>
Value: JSON array of messages
```

**Example:**
```json
[
  {
    "id": "welcome",
    "role": "assistant",
    "text": "नमस्ते! मैं ArthBot हूँ..."
  },
  {
    "id": "user-1234567890",
    "role": "user",
    "text": "What is SIP?"
  },
  {
    "id": "assistant-1234567891",
    "role": "assistant",
    "text": "## SIP (Systematic Investment Plan)...",
    "ragUsed": true,
    "sources": ["SIP"]
  }
]
```

### Context Provider

**ChatHistoryContext.jsx:**
- Manages chat messages state
- Loads from localStorage on mount
- Saves to localStorage on change
- Provides clear history function

### Component Integration

**Chat.jsx:**
- Uses `useChatHistory()` hook
- Adds messages via `addMessage()`
- Clears via `clearHistory()`
- Shows confirmation dialog

## Usage

### For Users

#### Viewing History
1. Open chat
2. All previous messages are automatically loaded
3. Scroll to see older messages

#### Clearing History
1. Click 🗑️ trash icon in header
2. Confirm deletion in dialog
3. History is cleared
4. Welcome message appears

#### Switching Accounts
1. Logout
2. Login with different account
3. See that account's history
4. Previous account's history is preserved

### For Developers

#### Access Chat History

```javascript
import { useChatHistory } from '../context/ChatHistoryContext'

function MyComponent() {
  const { messages, addMessage, clearHistory } = useChatHistory()
  
  // Read messages
  console.log(messages)
  
  // Add message
  addMessage({
    id: 'msg-123',
    role: 'user',
    text: 'Hello'
  })
  
  // Clear history
  clearHistory()
}
```

#### Message Structure

```javascript
{
  id: string,           // Unique identifier
  role: 'user' | 'assistant',
  text: string,         // Message content
  ragUsed?: boolean,    // Optional: RAG was used
  sources?: string[]    // Optional: Knowledge sources
}
```

#### Storage Key Format

```javascript
const STORAGE_KEY = 'arthbot_chat_history'
const userStorageKey = `${STORAGE_KEY}_${userId}`
```

## Storage Limits

### Browser localStorage Limits

**Typical Limits:**
- Chrome: 10 MB
- Firefox: 10 MB
- Safari: 5 MB
- Edge: 10 MB

**Estimated Capacity:**
- ~1000 messages (average 10 KB per message)
- ~5000 short messages
- ~500 long formatted messages

### Handling Full Storage

If storage is full:
1. Browser throws `QuotaExceededError`
2. New messages won't save
3. Old messages remain
4. Clear history to free space

**Auto-cleanup (future enhancement):**
```javascript
// Keep only last 100 messages
if (messages.length > 100) {
  messages = messages.slice(-100)
}
```

## Privacy & Security

### Data Storage
- ✅ Stored locally on device
- ✅ Not sent to server
- ✅ Per-user isolation
- ✅ Cleared on logout (optional)

### Security Considerations
- ⚠️ Accessible via browser DevTools
- ⚠️ Not encrypted
- ⚠️ Shared device risk
- ⚠️ Browser extensions can access

### Best Practices
1. Don't store sensitive data in messages
2. Clear history on shared devices
3. Logout when done on public computers
4. Use private browsing for sensitive chats

## Troubleshooting

### History Not Saving

**Check 1: localStorage Available**
```javascript
// Browser console
console.log(localStorage.getItem('arthbot_chat_history_1'))
```

**Check 2: User Logged In**
- History only saves for logged-in users
- Check user ID exists

**Check 3: Storage Not Full**
```javascript
// Test storage
try {
  localStorage.setItem('test', 'test')
  localStorage.removeItem('test')
  console.log('Storage working')
} catch (e) {
  console.log('Storage full or disabled')
}
```

### History Not Loading

**Check 1: Correct User**
- Verify logged in as expected user
- Check user ID matches

**Check 2: Data Format**
```javascript
// Browser console
const data = localStorage.getItem('arthbot_chat_history_1')
console.log(JSON.parse(data))
```

**Check 3: Clear Corrupted Data**
```javascript
// Browser console
localStorage.removeItem('arthbot_chat_history_1')
location.reload()
```

### Clear Button Not Working

**Check 1: Confirmation Dialog**
- Dialog should appear
- Click "Delete" to confirm

**Check 2: Console Errors**
- Open DevTools (F12)
- Check Console tab
- Look for errors

## Advanced Features

### Export Chat History

```javascript
function exportHistory() {
  const { messages } = useChatHistory()
  const json = JSON.stringify(messages, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'chat-history.json'
  a.click()
}
```

### Import Chat History

```javascript
function importHistory(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const messages = JSON.parse(e.target.result)
    setMessages(messages)
  }
  reader.readAsText(file)
}
```

### Search History

```javascript
function searchHistory(query) {
  const { messages } = useChatHistory()
  return messages.filter(msg => 
    msg.text.toLowerCase().includes(query.toLowerCase())
  )
}
```

### Message Statistics

```javascript
function getStats() {
  const { messages } = useChatHistory()
  return {
    total: messages.length,
    user: messages.filter(m => m.role === 'user').length,
    assistant: messages.filter(m => m.role === 'assistant').length,
    withRAG: messages.filter(m => m.ragUsed).length
  }
}
```

## Server-Side Storage (Future)

For persistent storage across devices:

### Backend Endpoint

```javascript
// Save chat history
POST /chat/history
{
  "messages": [...]
}

// Load chat history
GET /chat/history
Response: {
  "messages": [...]
}

// Clear chat history
DELETE /chat/history
```

### Sync Strategy

```javascript
// Save to server after each message
const addMessage = async (message) => {
  // Add to local state
  setMessages(prev => [...prev, message])
  
  // Sync to server
  await api.post('/chat/history', { messages: [...messages, message] })
}
```

## Testing

### Manual Testing

1. **Save Test:**
   - Send a message
   - Refresh page (F5)
   - Message should still be there

2. **Navigation Test:**
   - Send messages
   - Go to Dashboard
   - Return to Chat
   - Messages should persist

3. **Clear Test:**
   - Click 🗑️ button
   - Confirm deletion
   - History should be cleared

4. **Multi-User Test:**
   - Login as User A
   - Send messages
   - Logout
   - Login as User B
   - Should see different history

### Automated Testing

```javascript
describe('Chat History', () => {
  it('saves messages to localStorage', () => {
    const { addMessage } = useChatHistory()
    addMessage({ id: '1', role: 'user', text: 'Test' })
    
    const saved = localStorage.getItem('arthbot_chat_history_1')
    expect(JSON.parse(saved)).toHaveLength(1)
  })
  
  it('loads messages on mount', () => {
    localStorage.setItem('arthbot_chat_history_1', JSON.stringify([
      { id: '1', role: 'user', text: 'Test' }
    ]))
    
    const { messages } = useChatHistory()
    expect(messages).toHaveLength(1)
  })
  
  it('clears history', () => {
    const { clearHistory } = useChatHistory()
    clearHistory()
    
    const saved = localStorage.getItem('arthbot_chat_history_1')
    expect(saved).toBeNull()
  })
})
```

## Summary

Your chat history now:
- ✅ Saves automatically
- ✅ Persists across sessions
- ✅ Per-user storage
- ✅ Easy to clear
- ✅ Works offline
- ✅ No server needed

Navigate freely between pages - your chat history is always preserved! 🎉
