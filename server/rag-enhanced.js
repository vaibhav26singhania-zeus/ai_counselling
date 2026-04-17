import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load both knowledge bases
const smallKBPath = path.join(__dirname, 'knowledge-base.json');
const largeKBPath = path.join(__dirname, 'knowledge-base-extended.json');

let smallKB = null;
let largeKB = null;

// Load knowledge bases
function loadKnowledgeBases() {
  if (!smallKB && fs.existsSync(smallKBPath)) {
    smallKB = JSON.parse(fs.readFileSync(smallKBPath, 'utf-8'));
    console.log('✅ Loaded small knowledge base');
  }
  
  if (!largeKB && fs.existsSync(largeKBPath)) {
    largeKB = JSON.parse(fs.readFileSync(largeKBPath, 'utf-8'));
    console.log(`✅ Loaded large knowledge base (${largeKB.documents.length} documents)`);
  }
}

// Initialize
loadKnowledgeBases();

/**
 * Calculate similarity score with TF-IDF-like weighting
 */
function calculateSimilarity(query, keywords, content) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  let score = 0;
  
  // Keyword matching (higher weight)
  if (keywords && Array.isArray(keywords)) {
    keywords.forEach(keyword => {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });
  }
  
  // Query word matching in content
  queryWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = (content.match(regex) || []).length;
    score += matches;
  });
  
  // Boost for exact phrase match
  if (content.toLowerCase().includes(queryLower)) {
    score += 20;
  }
  
  return score;
}

/**
 * Search in small curated knowledge base
 */
function searchSmallKB(query, language = 'hi', topK = 3) {
  if (!smallKB) return [];
  
  const contentField = language === 'hi' ? 'content_hi' : 'content_en';
  
  const scoredDocs = smallKB.financial_concepts.map(doc => {
    const score = calculateSimilarity(query, doc.keywords, doc[contentField]);
    return {
      ...doc,
      score,
      content: doc[contentField],
      source: 'curated'
    };
  });
  
  return scoredDocs
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Search in large processed knowledge base
 */
function searchLargeKB(query, topK = 5) {
  if (!largeKB) return [];
  
  const scoredDocs = largeKB.documents.map(doc => {
    const score = calculateSimilarity(query, doc.keywords, doc.text);
    return {
      ...doc,
      score,
      content: doc.text,
      source: 'extended'
    };
  });
  
  return scoredDocs
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Hybrid search: combine both knowledge bases
 */
export function hybridSearch(query, language = 'hi', topK = 5) {
  const smallResults = searchSmallKB(query, language, 3);
  const largeResults = searchLargeKB(query, 5);
  
  // Combine and re-rank
  const allResults = [...smallResults, ...largeResults];
  
  // Boost curated content
  allResults.forEach(doc => {
    if (doc.source === 'curated') {
      doc.score *= 1.5; // 50% boost for curated content
    }
  });
  
  // Sort and return top K
  return allResults
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Build context from retrieved documents
 */
export function buildEnhancedContext(retrievedDocs, language = 'hi') {
  if (retrievedDocs.length === 0) {
    return '';
  }
  
  const contextHeader = language === 'hi' 
    ? 'संदर्भ जानकारी (निम्नलिखित जानकारी का उपयोग करके उत्तर दें):'
    : 'Context Information (Use the following information to answer):';
  
  const context = retrievedDocs
    .map((doc, idx) => {
      const title = doc.topic || `Document ${idx + 1}`;
      const content = doc.content.substring(0, 500); // Limit length
      return `${idx + 1}. ${title}: ${content}`;
    })
    .join('\n\n');
  
  return `${contextHeader}\n\n${context}\n\n`;
}

/**
 * Main enhanced RAG function
 */
export function performEnhancedRAG(query, language = 'hi', topK = 5) {
  const retrievedDocs = hybridSearch(query, language, topK);
  const context = buildEnhancedContext(retrievedDocs, language);
  
  return {
    context,
    retrievedDocs,
    hasContext: retrievedDocs.length > 0,
    sources: retrievedDocs.map(d => ({
      title: d.topic || d.id,
      source: d.source,
      score: d.score
    }))
  };
}

/**
 * Reload knowledge bases (useful after adding new data)
 */
export function reloadKnowledgeBases() {
  smallKB = null;
  largeKB = null;
  loadKnowledgeBases();
  console.log('🔄 Knowledge bases reloaded');
}
