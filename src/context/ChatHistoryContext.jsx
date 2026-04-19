import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ChatHistoryContext = createContext()

const STORAGE_KEY = 'arthbot_chat_history'

export function ChatHistoryProvider({ children }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])

  // Load messages from localStorage on mount
  useEffect(() => {
    if (user) {
      const storageKey = `${STORAGE_KEY}_${user.id}`
      const saved = localStorage.getItem(storageKey)
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMessages(parsed)
        } catch (error) {
          console.error('Failed to load chat history:', error)
          setMessages([])
        }
      }
    }
  }, [user])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      const storageKey = `${STORAGE_KEY}_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, user])

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message])
  }

  const clearHistory = () => {
    if (user) {
      const storageKey = `${STORAGE_KEY}_${user.id}`
      localStorage.removeItem(storageKey)
      setMessages([])
    }
  }

  const value = {
    messages,
    setMessages,
    addMessage,
    clearHistory
  }

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  )
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext)
  if (!context) {
    throw new Error('useChatHistory must be used within ChatHistoryProvider')
  }
  return context
}
