/**
 * Clean text for text-to-speech by removing markdown formatting
 * Keeps only the actual content that should be spoken
 */
export function cleanTextForSpeech(text) {
  let cleaned = text

  // Remove code blocks (```code```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '')

  // Remove inline code (`code`)
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1')

  // Remove headers (##, ###, etc.) but keep the text
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '$1')

  // Remove bold (**text** or __text__) but keep the text
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1')
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1')

  // Remove italic (*text* or _text_) but keep the text
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1')
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1')

  // Remove links [text](url) but keep the text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // Remove bullet points (-, *, •) but keep the text
  cleaned = cleaned.replace(/^[•\-\*]\s+/gm, '')

  // Remove numbered lists (1., 2., etc.) but keep the text
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '')

  // Remove horizontal rules
  cleaned = cleaned.replace(/^---+$/gm, '')

  // Remove blockquotes (>) but keep the text
  cleaned = cleaned.replace(/^>\s+/gm, '')

  // Replace multiple newlines with single space
  cleaned = cleaned.replace(/\n\n+/g, '. ')

  // Replace single newlines with space
  cleaned = cleaned.replace(/\n/g, ' ')

  // Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ')

  // Trim whitespace
  cleaned = cleaned.trim()

  // Add natural pauses for better speech
  // Add pause after sentences
  cleaned = cleaned.replace(/\.\s+/g, '. ')
  
  // Add pause after colons (for lists)
  cleaned = cleaned.replace(/:\s+/g, ': ')

  return cleaned
}

/**
 * Get a summary of text for speech (first few sentences)
 * Useful for very long messages
 */
export function getSpeechSummary(text, maxLength = 500) {
  const cleaned = cleanTextForSpeech(text)
  
  if (cleaned.length <= maxLength) {
    return cleaned
  }

  // Find the last sentence within maxLength
  const truncated = cleaned.substring(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('.')
  
  if (lastPeriod > 0) {
    return truncated.substring(0, lastPeriod + 1)
  }
  
  return truncated + '...'
}

/**
 * Test if text is too long for comfortable speech
 */
export function isTextTooLongForSpeech(text, maxLength = 1000) {
  const cleaned = cleanTextForSpeech(text)
  return cleaned.length > maxLength
}
