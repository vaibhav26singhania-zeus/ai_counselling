# How to Add Your 35MB File to the Knowledge Base

## TL;DR (Quick Version)

```bash
# 1. Copy your file to server folder
cp your-file.txt server/

# 2. Process it
cd server
node document-processor.js your-file.txt

# 3. Restart server
npm start

# Done! Your chatbot now knows everything in your file.
```

## What You Need

- Your 35MB file (text, JSON, or markdown format)
- Node.js installed
- 5 minutes

## Detailed Steps

### Step 1: Place Your File

Put your file in the `server/` directory:

```
ai_counselling/
├── server/
│   ├── your-large-file.txt  ← Your 35MB file here
│   ├── document-processor.js
│   └── server.js
```

### Step 2: Run the Processor

Open terminal/command prompt:

```bash
cd server
node document-processor.js your-large-file.txt
```

**What happens:**
- File is read and split into chunks
- Keywords are extracted automatically
- Everything is saved to `knowledge-base-extended.json`
- Takes 15-30 seconds for 35MB file

**You'll see:**
```
📄 Processing file: your-large-file.txt
📊 File size: 35.00 MB
✂️ Created 43,750 chunks
✅ Processing complete!
```

### Step 3: Restart Your Server

```bash
npm start
```

The server automatically detects and uses your new knowledge base!

### Step 4: Test It

1. Open your chat app
2. Ask questions about content in your file
3. Look for the 📚 "Knowledge Base" badge on responses

## Supported File Types

### Text Files (.txt)
Best for: Books, guides, documentation
```
Just plain text content.
Can include any information.
Will be automatically chunked.
```

### JSON Files (.json)
Best for: Structured data, FAQs, databases
```json
{
  "topics": [
    {"title": "Topic 1", "content": "..."},
    {"title": "Topic 2", "content": "..."}
  ]
}
```

### Markdown Files (.md)
Best for: Documentation, formatted content
```markdown
# Topic 1
Content here...

# Topic 2
More content...
```

## How It Works

1. **Your 35MB file** → Split into ~43,000 chunks
2. **Each chunk** → ~1000 characters with 200 char overlap
3. **Keywords extracted** → Automatically from each chunk
4. **Indexed** → For fast retrieval
5. **RAG system** → Finds relevant chunks when you ask questions
6. **LLM** → Generates answer using retrieved information

## Example

Let's say your file contains financial regulations:

**Before processing:**
- User asks: "What are the tax rules for 2024?"
- Bot: Generic answer from LLM training data

**After processing:**
- User asks: "What are the tax rules for 2024?"
- System: Finds relevant chunks from your file
- Bot: Specific answer from YOUR document with 📚 badge

## Troubleshooting

### "Cannot find file"
Make sure file is in `server/` directory:
```bash
ls server/your-file.txt  # Should show the file
```

### "Out of memory"
Increase Node.js memory:
```bash
node --max-old-space-size=4096 document-processor.js your-file.txt
```

### File is too large (>100MB)
Split it first:
```bash
# Split into 30MB chunks
split -b 30M your-huge-file.txt part_

# Process each part
node document-processor.js part_aa
node document-processor.js part_ab
```

## Advanced Options

### Custom chunk size
Edit `document-processor.js`:
```javascript
const CHUNK_SIZE = 1500;  // Larger chunks
const CHUNK_OVERLAP = 300; // More overlap
```

### Custom output location
```bash
node document-processor.js input.txt custom-output.json
```

### Process multiple files
```bash
node document-processor.js file1.txt
node document-processor.js file2.txt
# Both will be used by the system
```

## Performance

| File Size | Processing Time | Memory Used | Search Speed |
|-----------|----------------|-------------|--------------|
| 10 MB     | 5-10 sec       | ~50 MB      | Instant      |
| 35 MB     | 15-30 sec      | ~150 MB     | < 200ms      |
| 100 MB    | 1-2 min        | ~400 MB     | < 500ms      |

## Verification

Check if it worked:

1. **File created:**
```bash
ls -lh server/knowledge-base-extended.json
```

2. **Server logs:**
```
✅ Loaded large knowledge base (43750 documents)
```

3. **Chat response:**
Look for 📚 badge on answers

## Complete Example

```bash
# You have: company-handbook.txt (35MB)

# 1. Copy to server
cp ~/Documents/company-handbook.txt server/

# 2. Process
cd server
node document-processor.js company-handbook.txt

# Output:
# 📄 Processing file: company-handbook.txt
# 📊 File size: 35.00 MB
# ✂️ Created 43,750 chunks
# ✅ Processing complete!

# 3. Restart
npm start

# 4. Test in chat:
# Q: "What is our vacation policy?"
# A: [Answer from your handbook] 📚 Knowledge Base

# Success! ✅
```

## What's Next?

- Add more files as needed
- Update files by reprocessing them
- Monitor search performance
- Adjust chunk size if needed

## Need More Help?

See detailed guides:
- `server/QUICK-START-LARGE-FILES.md` - Step-by-step guide
- `server/ADDING-LARGE-FILES.md` - Complete documentation
- `server/RAG-README.md` - How RAG works

---

**That's it!** Your 35MB file is now part of your chatbot's knowledge base. 🎉
