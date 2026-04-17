# Adding Large Files to Knowledge Base (35MB+)

This guide explains how to add large documents to your RAG system.

## Quick Start

### Step 1: Place Your File

Put your 35MB file in the `server/` directory. Supported formats:
- `.txt` - Plain text
- `.json` - JSON data
- `.md` - Markdown

Example:
```
server/
  ├── my-large-document.txt
  └── document-processor.js
```

### Step 2: Process the File

Run the document processor:

```bash
cd server
node document-processor.js my-large-document.txt
```

This will:
1. Read your file
2. Split it into manageable chunks (1000 chars each with 200 char overlap)
3. Extract keywords from each chunk
4. Save to `knowledge-base-extended.json`

### Step 3: Update Server to Use Enhanced RAG

The server is already configured to use both knowledge bases automatically!

## Detailed Instructions

### For Text Files (.txt, .md)

```bash
# Process a text file
node document-processor.js path/to/your-file.txt

# Specify custom output location
node document-processor.js path/to/your-file.txt custom-output.json
```

**What happens:**
- File is split into chunks of ~1000 characters
- Each chunk overlaps by 200 characters (for context continuity)
- Keywords are automatically extracted
- Chunks are indexed for fast retrieval

### For JSON Files

```bash
# Process a JSON file
node document-processor.js path/to/your-data.json
```

**Supported JSON structures:**

1. **Array of objects:**
```json
[
  {"title": "Topic 1", "content": "..."},
  {"title": "Topic 2", "content": "..."}
]
```

2. **Object with keys:**
```json
{
  "topic1": {"content": "..."},
  "topic2": {"content": "..."}
}
```

### For PDF Files

First, convert PDF to text:

```bash
# Using pdftotext (install: apt-get install poppler-utils)
pdftotext your-file.pdf output.txt

# Then process
node document-processor.js output.txt
```

## Configuration

Edit `document-processor.js` to customize:

```javascript
const CHUNK_SIZE = 1000;      // Characters per chunk
const CHUNK_OVERLAP = 200;    // Overlap between chunks
```

**Recommendations:**
- **Small chunks (500-1000)**: Better for specific queries
- **Large chunks (2000-3000)**: Better for context-heavy queries
- **Overlap (100-300)**: Prevents information loss at boundaries

## Using Enhanced RAG

The system automatically uses both knowledge bases:

1. **Curated KB** (`knowledge-base.json`): Small, high-quality financial topics
2. **Extended KB** (`knowledge-base-extended.json`): Your large processed file

**Priority:**
- Curated content gets 50% score boost
- Both sources are searched and combined
- Top results from both are returned

## Testing

Test your processed knowledge base:

```bash
# Test RAG with your new data
npm run test:rag
```

## Example: Processing a 35MB Financial Document

```bash
# 1. Place your file
cp ~/Downloads/financial-guide.txt server/

# 2. Process it
cd server
node document-processor.js financial-guide.txt

# Output:
# 📄 Processing file: financial-guide.txt
# 📊 File size: 35.00 MB
# 📝 Content length: 36700000 characters
# ✂️ Created 45875 chunks
# ✅ Processed 45875 documents
# 💾 Saved to: knowledge-base-extended.json

# 3. Restart server
npm start

# 4. Test in chat!
```

## Performance Considerations

### File Size Limits

- **< 10MB**: Processes in seconds
- **10-50MB**: Processes in 10-30 seconds
- **50-100MB**: May take 1-2 minutes
- **> 100MB**: Consider splitting into multiple files

### Memory Usage

The system loads the entire knowledge base into memory:
- 35MB file → ~50-70MB in memory (with metadata)
- Ensure your server has adequate RAM

### Search Performance

- **< 1000 documents**: Instant search
- **1000-10000 documents**: < 100ms
- **10000-50000 documents**: < 500ms
- **> 50000 documents**: Consider using vector database (see below)

## Advanced: Using Vector Embeddings

For very large files (>100MB) or better semantic search, use embeddings:

### Option 1: Ollama Embeddings

```bash
# Install embedding model
ollama pull nomic-embed-text

# Process with embeddings (coming soon)
node document-processor-embeddings.js your-file.txt
```

### Option 2: External Vector DB

Consider using:
- **ChromaDB**: Python-based, easy to use
- **Pinecone**: Cloud-based, scalable
- **Weaviate**: Open-source, self-hosted

## Troubleshooting

### "Out of Memory" Error

**Solution 1**: Increase Node.js memory
```bash
node --max-old-space-size=4096 document-processor.js large-file.txt
```

**Solution 2**: Process in batches
```bash
# Split file first
split -l 100000 large-file.txt chunk_

# Process each chunk
for file in chunk_*; do
  node document-processor.js $file
done
```

### "File too large" Error

Split your file:
```bash
# Split into 10MB chunks
split -b 10M large-file.txt part_

# Process each part
node document-processor.js part_aa
node document-processor.js part_ab
```

### Slow Search Performance

**Solution**: Add indexing
- Use the enhanced RAG system (already implemented)
- Consider vector embeddings for semantic search
- Cache frequent queries

## File Format Examples

### Good Text Format

```
Topic: SIP Investment

SIP (Systematic Investment Plan) is a method...

Benefits:
1. Rupee cost averaging
2. Disciplined investing
...

Topic: Tax Saving

Section 80C allows deductions...
```

### Good JSON Format

```json
{
  "financial_concepts": [
    {
      "topic": "SIP",
      "content": "SIP is a method...",
      "keywords": ["sip", "investment", "mutual fund"]
    }
  ]
}
```

## Next Steps

1. Process your 35MB file
2. Test queries in the chat
3. Monitor performance
4. Adjust chunk size if needed
5. Add more documents as needed

## Support

For issues or questions:
- Check server logs for processing errors
- Verify JSON format is valid
- Ensure file encoding is UTF-8
- Test with smaller file first
