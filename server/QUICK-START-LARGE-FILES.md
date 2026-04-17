# Quick Start: Adding Your 35MB File

## Step-by-Step Guide

### 1. Prepare Your File

Place your 35MB file in the `server/` directory:

```bash
# Copy your file to server directory
cp /path/to/your-large-file.txt server/
# or
cp /path/to/your-data.json server/
```

**Supported formats:**
- `.txt` - Plain text files
- `.json` - JSON data
- `.md` - Markdown files

### 2. Process the File

```bash
cd server

# Process your file
node document-processor.js your-large-file.txt

# Example output:
# 📄 Processing file: your-large-file.txt
# 📊 File size: 35.00 MB
# 📝 Content length: 36700000 characters
# ✂️ Created 45875 chunks
# 💾 Saved to: knowledge-base-extended.json
# ✅ Processing complete!
```

### 3. Restart Server

```bash
npm start
```

The server will automatically detect and use your processed knowledge base!

### 4. Test It

Open your chat app and ask questions related to your document content. You'll see:
- 📚 "Knowledge Base" badge on responses using your data
- Faster, more accurate answers based on your content

## What Happens Behind the Scenes

1. **Chunking**: Your 35MB file is split into ~1000 character chunks
2. **Keyword Extraction**: Important keywords are extracted from each chunk
3. **Indexing**: Chunks are indexed for fast retrieval
4. **Hybrid Search**: System searches both curated KB and your large file
5. **Smart Ranking**: Results are ranked by relevance and source quality

## Configuration Options

### Adjust Chunk Size

Edit `document-processor.js`:

```javascript
const CHUNK_SIZE = 1000;      // Default: 1000 characters
const CHUNK_OVERLAP = 200;    // Default: 200 characters
```

**When to adjust:**
- **Smaller chunks (500-800)**: For FAQ-style content
- **Larger chunks (1500-2000)**: For narrative/contextual content
- **More overlap (300-400)**: When context is crucial

### Custom Output Location

```bash
node document-processor.js input.txt custom-output.json
```

## File Format Tips

### For Best Results

**Text Files (.txt, .md):**
```
Topic: Investment Basics

Clear section headers help with retrieval.
Use paragraphs to separate concepts.

Topic: Tax Planning

Each topic should be self-contained.
Include relevant keywords naturally.
```

**JSON Files:**
```json
{
  "topics": [
    {
      "title": "Investment Basics",
      "content": "Detailed content here...",
      "keywords": ["investment", "stocks", "bonds"]
    }
  ]
}
```

## Real-World Example

### Processing a Financial Guide

```bash
# 1. You have: financial-guide-2024.txt (35MB)
cp ~/Documents/financial-guide-2024.txt server/

# 2. Process it
cd server
node document-processor.js financial-guide-2024.txt

# Output shows:
# ✂️ Created 43,750 chunks
# 💾 Saved to: knowledge-base-extended.json

# 3. Restart server
npm start

# 4. Now ask in chat:
# "What are the best tax-saving options for 2024?"
# "Tell me about retirement planning strategies"
# "How to invest in mutual funds?"
```

## Troubleshooting

### Problem: "Out of Memory"

**Solution:**
```bash
node --max-old-space-size=4096 document-processor.js large-file.txt
```

### Problem: File Too Large (>100MB)

**Solution 1 - Split the file:**
```bash
# Windows (PowerShell)
Get-Content large-file.txt -ReadCount 50000 | Set-Content -Path "chunk_{0}.txt"

# Linux/Mac
split -l 50000 large-file.txt chunk_
```

**Solution 2 - Process in parts:**
```bash
node document-processor.js part1.txt output1.json
node document-processor.js part2.txt output2.json
# Then manually merge the JSON files
```

### Problem: Slow Search

If search is slow with very large files:
1. Reduce chunk size to create fewer chunks
2. Use more specific keywords in your queries
3. Consider using vector embeddings (advanced)

## Performance Expectations

| File Size | Processing Time | Chunks Created | Search Speed |
|-----------|----------------|----------------|--------------|
| 1 MB      | 1-2 seconds    | ~1,250         | Instant      |
| 10 MB     | 5-10 seconds   | ~12,500        | < 50ms       |
| 35 MB     | 15-30 seconds  | ~43,750        | < 200ms      |
| 100 MB    | 1-2 minutes    | ~125,000       | < 500ms      |

## Verifying It Works

### Check the Output File

```bash
# View first few lines
head -n 50 knowledge-base-extended.json

# Check file size
ls -lh knowledge-base-extended.json
```

### Test RAG System

```bash
npm run test:rag
```

### Check Server Logs

When you send a chat message, look for:
```
🔍 Performing RAG retrieval...
✅ Retrieved 5 relevant documents
📚 Using enhanced RAG with large knowledge base
Topics: Investment Basics, Tax Planning, ...
```

## Next Steps

1. ✅ Process your 35MB file
2. ✅ Restart server
3. ✅ Test with relevant queries
4. 📝 Add more files as needed
5. 🎯 Fine-tune chunk size if needed

## Need Help?

- Check `ADDING-LARGE-FILES.md` for detailed documentation
- Review `server/RAG-README.md` for RAG system details
- Look at server logs for processing errors
- Test with smaller file first if unsure

## Summary

```bash
# The complete workflow:
cd server
node document-processor.js your-35mb-file.txt
npm start
# Done! Your knowledge base is ready.
```

Your chatbot now has access to all the information in your 35MB file! 🎉
