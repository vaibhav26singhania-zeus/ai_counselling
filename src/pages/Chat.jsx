import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useChatHistory } from '../context/ChatHistoryContext'
import { sendChatMessage } from '../services/api'
import VoiceInput from '../components/VoiceInput'
import MessageFormatter from '../components/MessageFormatter'
import { useSpeech } from '../hooks/useSpeech'
import { translations } from '../utils/translations'

export default function Chat() {
  const { messages, setMessages, addMessage, clearHistory } = useChatHistory()
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { authToken } = useAuth()
  const { language, t } = useLanguage()
  const { speak, stop, speaking, supported: speechSupported } = useSpeech()

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: t(translations.chat.welcome),
        },
      ])
    }
  }, [language])

  const quickPrompts = translations.quickPrompts[language]

  const appendMessage = (message) => {
    addMessage(message)
  }

  const handleClearHistory = () => {
    setShowClearConfirm(true)
  }

  const confirmClearHistory = () => {
    clearHistory()
    setShowClearConfirm(false)
    // Add welcome message after clearing
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: t(translations.chat.welcome),
      },
    ])
  }

  const cancelClearHistory = () => {
    setShowClearConfirm(false)
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
      const response = await sendChatMessage(trimmed, authToken, language)
      const assistantText = response?.answer || t(translations.chat.noResponse)
      
      appendMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: assistantText,
        ragUsed: response?.rag_used,
        sources: response?.sources
      })

      // Auto-speak the response if enabled
      if (autoSpeak && speechSupported) {
        speak(assistantText, language === 'hi' ? 'hi-IN' : 'en-US')
      }
    } catch (err) {
      console.error('Chat error:', err)
      let errorMsg = t(translations.chat.errorSending)
      
      if (err.response) {
        console.error('Error response:', err.response.data)
        
        // Check for auth errors
        if (err.response.status === 401 || err.response.status === 403) {
          errorMsg = t(translations.chat.errorAuth)
          // Logout will be handled by axios interceptor
        } else {
          errorMsg = `Error: ${err.response.data.error || err.response.data.details || 'Unknown error'}`
        }
      } else if (err.request) {
        errorMsg = t(translations.chat.errorConnection)
      }
      
      setError(errorMsg)
      
      appendMessage({
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: errorMsg,
      })
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
          <button type="button" className="back-button" onClick={() => window.history.back()}>←</button>
          <div>
            <h1>{t(translations.chat.title)}</h1>
            <p>{t(translations.chat.subtitle)}</p>
          </div>
          <div className="header-actions">
            {speechSupported && (
              <button
                type="button"
                className={`speaker-toggle-btn ${autoSpeak ? 'active' : ''}`}
                onClick={() => setAutoSpeak(!autoSpeak)}
                title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
              >
                {autoSpeak ? '🔊' : '🔇'}
              </button>
            )}
            <button
              type="button"
              className="clear-history-btn"
              onClick={handleClearHistory}
              title={language === 'hi' ? 'इतिहास साफ़ करें' : 'Clear History'}
            >
              🗑️
            </button>
          </div>
        </header>

        <div className="assistant-card">
          <div className="assistant-avatar">🤖</div>
          <div>
            <div className="assistant-title">{t(translations.chat.title)}</div>
            <div className="assistant-tag">{t(translations.chat.online)} • {language === 'hi' ? 'हिंदी' : 'English'}</div>
          </div>
        </div>

        <div className="quick-asks">
          <div className="quick-label">{t(translations.chat.quickAsk)}</div>
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
              <div className="message-bubble">
                <MessageFormatter text={message.text} />
                {message.role === 'assistant' && message.ragUsed && (
                  <div className="rag-badge" title={`Sources: ${message.sources?.join(', ')}`}>
                    📚 Knowledge Base
                  </div>
                )}
                {message.role === 'assistant' && speechSupported && (
                  <button
                    type="button"
                    className="speak-button"
                    onClick={() => speak(message.text, language === 'hi' ? 'hi-IN' : 'en-US')}
                    disabled={speaking}
                    title="Read aloud"
                  >
                    {speaking ? '⏸️' : '🔊'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {showClearConfirm && (
          <div className="confirm-dialog">
            <div className="confirm-content">
              <h3>{language === 'hi' ? 'इतिहास साफ़ करें?' : 'Clear History?'}</h3>
              <p>
                {language === 'hi' 
                  ? 'क्या आप सभी चैट संदेशों को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।'
                  : 'Are you sure you want to delete all chat messages? This action cannot be undone.'}
              </p>
              <div className="confirm-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={cancelClearHistory}
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button 
                  type="button" 
                  className="confirm-button"
                  onClick={confirmClearHistory}
                >
                  {language === 'hi' ? 'हटाएं' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="chat-controls">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(translations.chat.placeholder)}
            rows={2}
          />
          <div className="controls-row">
            <VoiceInput onResult={handleResult} language={language} />
            <button
              type="button"
              className="primary-button"
              onClick={() => handleSend()}
              disabled={sending || !input.trim()}
            >
              {sending ? t(translations.chat.sending) : t(translations.chat.send)}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
