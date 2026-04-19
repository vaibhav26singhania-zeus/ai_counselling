import { useMemo } from 'react'

export default function MessageFormatter({ text }) {
  const formattedContent = useMemo(() => {
    // Parse markdown-like formatting
    let html = text

    // Headers (## Header, ### Subheader)
    html = html.replace(/^### (.+)$/gm, '<h3 class="msg-subheader">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="msg-header">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="msg-title">$1</h1>')

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

    // Italic (*text* or _text_)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/_(.+?)_/g, '<em>$1</em>')

    // Code blocks (```code```)
    html = html.replace(/```(.+?)```/gs, '<pre class="msg-code-block"><code>$1</code></pre>')

    // Inline code (`code`)
    html = html.replace(/`(.+?)`/g, '<code class="msg-inline-code">$1</code>')

    // Bullet points (- item or * item)
    html = html.replace(/^[•\-\*] (.+)$/gm, '<li class="msg-bullet">$1</li>')
    
    // Wrap consecutive list items in ul
    html = html.replace(/(<li class="msg-bullet">.+?<\/li>\n?)+/gs, '<ul class="msg-list">$&</ul>')

    // Numbered lists (1. item)
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="msg-numbered">$1</li>')
    
    // Wrap consecutive numbered items in ol
    html = html.replace(/(<li class="msg-numbered">.+?<\/li>\n?)+/gs, '<ol class="msg-numbered-list">$&</ol>')

    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>')
    html = html.replace(/\n/g, '<br/>')

    // Links [text](url)
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="msg-link">$1</a>')

    return html
  }, [text])

  return (
    <div 
      className="message-content"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  )
}
