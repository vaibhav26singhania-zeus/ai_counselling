import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { sendChatMessage } from '../services/api'
import VoiceInput from '../components/VoiceInput'

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'नमस्ते! मैं ArthBot हूँ। अपनी बचत, लक्ष्य या निवेश के बारे में पूछें, मैं आपकी मदद करूँगा।',
  },
]

const quickPrompts = [
  'SIP क्या है?',
  'बचत कैसे करें?',
  'Home Loan tips',
  'Tax saving ideas',
]

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const { authToken } = useAuth()

  const appendMessage = (message) => {
    setMessages((current) => [...current, message])
  }

  const handleSend = async (messageText = input) => {
    const trimmed = messageText.trim()
    if (!trimmed) {
      return
    }

    appendMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    })

    setInput('')
    setSending(true)
    setError('')

    try {
      const response = await sendChatMessage(trimmed, authToken)
      appendMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response?.answer || 'माफ़ कीजिए, सर्वर से कोई उत्तर नहीं मिला।',
      })
    } catch (err) {
      setError('मैसेज भेजने में असफल। कृपया फिर से प्रयास करें।')
    } finally {
      setSending(false)
    }
  }

  const handleResult = (text) => {
    setInput((current) => (current ? `${current} ${text}` : text))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="page chat-page">
      <div className="mobile-panel">
        <header className="dashboard-header">
          <button type="button" className="back-button">←</button>
          <div>
            <h1>ArthBot</h1>
            <p>AI Financial Advisor</p>
          </div>
        </header>

        <div className="assistant-card">
          <div className="assistant-avatar">🤖</div>
          <div>
            <div className="assistant-title">ArthBot</div>
            <div className="assistant-tag">Online • हिंदी</div>
          </div>
        </div>

        <div className="quick-asks">
          <div className="quick-label">जल्दी पूछें / Quick Ask</div>
          <div className="quick-list">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="quick-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-window">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
            >
              <div className="message-bubble">{message.text}</div>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="chat-controls">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="हिंदी में लिखें... / Type here..."
            rows={2}
          />
          <div className="controls-row">
            <VoiceInput onResult={handleResult} />
            <button
              type="button"
              className="primary-button"
              onClick={() => handleSend()}
              disabled={sending || !input.trim()}
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
