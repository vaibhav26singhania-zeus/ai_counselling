import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Document Processor for Large Files
 * Handles chunking, processing, and indexing of large documents
 */

// Configuration
const CHUNK_SIZE = 1000; // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks

/**
 * Split text into chunks with overlap
 */
function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    
    if (chunk.trim().length > 0) {
      chunks.push({
        text: chunk.trim(),
        start,
        end
      });
    }
    
    start += chunkSize - overlap;
  }
  
  return chunks;
}

/**
 * Extract keywords from text (simple approach)
 */
function extractKeywords(text, topN = 10) {
  // Remove common words (stopwords)
  const stopwords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this',
    'से', 'का', 'की', 'के', 'में', 'को', 'है', 'हैं', 'था', 'थी', 'थे'
  ]);
  
  // Tokenize and count
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word));
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sort by frequency and return top N
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Process a large text file
 */
export function processTextFile(filePath) {
  console.log(`📄 Processing file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileSize = (content.length / 1024 / 1024).toFixed(2);
  
  console.log(`📊 File size: ${fileSize} MB`);
  console.log(`📝 Content length: ${content.length} characters`);
  
  // Split into chunks
  const chunks = chunkText(content);
  console.log(`✂️ Created ${chunks.length} chunks`);
  
  // Process each chunk
  const processedChunks = chunks.map((chunk, idx) => {
    const keywords = extractKeywords(chunk.text);
    
    return {
      id: `chunk_${idx}`,
      text: chunk.text,
      keywords,
      start: chunk.start,
      end: chunk.end,
      length: chunk.text.length
    };
  });
  
  return processedChunks;
}

/**
 * Process JSON data (structured)
 */
export function processJSONFile(filePath) {
  console.log(`📄 Processing JSON file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  const processedDocs = [];
  
  // Handle different JSON structures
  if (Array.isArray(data)) {
    data.forEach((item, idx) => {
      const text = JSON.stringify(item);
      const keywords = extractKeywords(text);
      
      processedDocs.push({
        id: `doc_${idx}`,
        text,
        keywords,
        metadata: item
      });
    });
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      const text = typeof value === 'string' ? value : JSON.stringify(value);
      const keywords = extractKeywords(text);
      
      processedDocs.push({
        id: key,
        text,
        keywords,
        metadata: value
      });
    });
  }
  
  console.log(`✅ Processed ${processedDocs.length} documents`);
  return processedDocs;
}

/**
 * Save processed documents to knowledge base
 */
export function saveToKnowledgeBase(processedDocs, outputPath = null) {
  const outputFile = outputPath || path.join(__dirname, 'knowledge-base-extended.json');
  
  const knowledgeBase = {
    metadata: {
      created: new Date().toISOString(),
      total_documents: processedDocs.length,
      total_size: JSON.stringify(processedDocs).length
    },
    documents: processedDocs
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(knowledgeBase, null, 2));
  console.log(`💾 Saved to: ${outputFile}`);
  console.log(`📊 Total documents: ${processedDocs.length}`);
  
  return outputFile;
}

/**
 * Main processing function
 */
export function processLargeFile(filePath, options = {}) {
  const ext = path.extname(filePath).toLowerCase();
  let processedDocs;
  
  try {
    if (ext === '.json') {
      processedDocs = processJSONFile(filePath);
    } else if (ext === '.txt' || ext === '.md') {
      processedDocs = processTextFile(filePath);
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }
    
    // Save to knowledge base
    const outputPath = options.output || null;
    const savedPath = saveToKnowledgeBase(processedDocs, outputPath);
    
    return {
      success: true,
      documentsProcessed: processedDocs.length,
      outputPath: savedPath
    };
  } catch (error) {
    console.error('❌ Error processing file:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// CLI usage
if (process.argv[2]) {
  const filePath = process.argv[2];
  const outputPath = process.argv[3];
  
  console.log('🚀 Starting document processing...\n');
  const result = processLargeFile(filePath, { output: outputPath });
  
  if (result.success) {
    console.log('\n✅ Processing complete!');
    console.log(`📁 Output: ${result.outputPath}`);
  } else {
    console.log('\n❌ Processing failed!');
    console.log(`Error: ${result.error}`);
  }
}
