import { useState, useEffect, useCallback } from 'react'
import { cleanTextForSpeech } from '../utils/textCleaner'

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
  }, [])

  const speak = useCallback((text, lang = 'hi-IN') => {
    if (!window.speechSynthesis) {
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Clean text for speech (remove markdown)
    const cleanedText = cleanTextForSpeech(text)

    const utterance = new SpeechSynthesisUtterance(cleanedText)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [])

  return { speak, stop, speaking, supported }
}
