import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load knowledge base
const knowledgeBasePath = path.join(__dirname, 'knowledge-base.json');
const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));

// Simple text similarity using keyword matching and TF-IDF-like scoring
function calculateSimilarity(query, keywords, content) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  let score = 0;
  
  // Keyword matching (higher weight)
  keywords.forEach(keyword => {
    if (queryLower.includes(keyword.toLowerCase())) {
      score += 10;
    }
  });
  
  // Content word matching
  queryWords.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      score += 1;
    }
  });
  
  return score;
}

// Retrieve relevant documents from knowledge base
export function retrieveRelevantDocs(query, language = 'hi', topK = 3) {
  const contentField = language === 'hi' ? 'content_hi' : 'content_en';
  
  // Calculate similarity scores for all documents
  const scoredDocs = knowledgeBase.financial_concepts.map(doc => {
    const score = calculateSimilarity(query, doc.keywords, doc[contentField]);
    return {
      ...doc,
      score,
      content: doc[contentField]
    };
  });
  
  // Sort by score and return top K
  const topDocs = scoredDocs
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return topDocs;
}

// Build context from retrieved documents
export function buildContext(retrievedDocs, language = 'hi') {
  if (retrievedDocs.length === 0) {
    return '';
  }
  
  const contextHeader = language === 'hi' 
    ? 'संदर्भ जानकारी (निम्नलिखित जानकारी का उपयोग करके उत्तर दें):'
    : 'Context Information (Use the following information to answer):';
  
  const context = retrievedDocs
    .map((doc, idx) => `${idx + 1}. ${doc.topic}: ${doc.content}`)
    .join('\n\n');
  
  return `${contextHeader}\n\n${context}\n\n`;
}

// Main RAG function
export function performRAG(query, language = 'hi') {
  const retrievedDocs = retrieveRelevantDocs(query, language, 3);
  const context = buildContext(retrievedDocs, language);
  
  return {
    context,
    retrievedDocs,
    hasContext: retrievedDocs.length > 0
  };
}
