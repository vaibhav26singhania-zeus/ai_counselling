import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../utils/translations'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null

export default function VoiceInput({ onResult, language: propLanguage }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(Boolean(SpeechRecognition))
  const { language: contextLanguage, t } = useLanguage()
  
  const language = propLanguage || contextLanguage

  useEffect(() => {
    setSupported(Boolean(SpeechRecognition))
  }, [])

  const handleVoice = () => {
    if (!SpeechRecognition) {
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const speech = event.results[0]?.[0]?.transcript || ''
      if (speech.trim()) {
        onResult(speech.trim())
      }
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.start()
  }

  if (!supported) {
    return null
  }

  return (
    <button
      type="button"
      className={`voice-button ${listening ? 'listening' : ''}`}
      onClick={handleVoice}
      aria-label="Start voice input"
    >
      {listening ? `🎤 ${t(translations.chat.listening)}` : `🎤 ${t(translations.chat.voice)}`}
    </button>
  )
}
