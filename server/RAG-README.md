# RAG (Retrieval-Augmented Generation) System

## Overview

The chatbot now uses RAG to provide more accurate and contextual financial advice by retrieving relevant information from a curated knowledge base before generating responses.

## How It Works

1. **User Query** → Received by the server
2. **Retrieval** → System searches knowledge base for relevant documents
3. **Context Building** → Top matching documents are formatted as context
4. **Generation** → LLM generates response using retrieved context + user query
5. **Response** → Answer sent back with RAG metadata

## Knowledge Base

Located in `knowledge-base.json`, contains financial topics:

- SIP (Systematic Investment Plan)
- Savings Tips
- Home Loans
- Tax Saving
- Emergency Fund
- Credit Score
- Mutual Funds
- Fixed Deposits
- Insurance
- Retirement Planning

Each topic includes:
- Keywords for matching
- Content in both Hindi and English
- Topic categorization

## RAG Algorithm

### Similarity Scoring
- **Keyword Match**: +10 points per matching keyword
- **Content Match**: +1 point per matching word in content
- **Top-K Retrieval**: Returns top 3 most relevant documents

### Context Building
- Formats retrieved documents with topic and content
- Adds language-specific header
- Injects into LLM prompt before user query

## Testing

```bash
# Test RAG retrieval
npm run test:rag

# Test full system
npm test
```

## Adding New Knowledge

Edit `knowledge-base.json`:

```json
{
  "id": "new_topic",
  "topic": "Topic Name",
  "keywords": ["keyword1", "keyword2"],
  "content_en": "English content here",
  "content_hi": "हिंदी सामग्री यहाँ"
}
```

## API Response

When RAG is used, the response includes:

```json
{
  "answer": "Generated response",
  "model": "llama3.2:1b",
  "language": "hi",
  "rag_used": true,
  "sources": ["SIP", "Mutual Funds"]
}
```

## Frontend Integration

- Messages with RAG show a "📚 Knowledge Base" badge
- Hover over badge to see source topics
- Indicates response is grounded in verified information

## Benefits

1. **Accuracy**: Responses based on curated financial information
2. **Consistency**: Same facts across all responses
3. **Transparency**: Users see when knowledge base is used
4. **Multilingual**: Works seamlessly in Hindi and English
5. **Extensible**: Easy to add new financial topics

## Future Enhancements

- Vector embeddings for better semantic search
- User feedback to improve retrieval
- Dynamic knowledge base updates
- Citation links to source documents
- Confidence scores for retrieved documents
