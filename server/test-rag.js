import { performRAG } from './rag.js';

console.log('Testing RAG System\n');
console.log('='.repeat(50));

const testQueries = [
  { query: 'What is SIP?', lang: 'en' },
  { query: 'SIP क्या है?', lang: 'hi' },
  { query: 'How to save money?', lang: 'en' },
  { query: 'बचत कैसे करें?', lang: 'hi' },
  { query: 'Tell me about home loans', lang: 'en' },
  { query: 'टैक्स कैसे बचाएं?', lang: 'hi' },
  { query: 'What is the weather today?', lang: 'en' }, // Should return no context
];

testQueries.forEach((test, idx) => {
  console.log(`\nTest ${idx + 1}: "${test.query}" (${test.lang})`);
  console.log('-'.repeat(50));
  
  const result = performRAG(test.query, test.lang);
  
  if (result.hasContext) {
    console.log(`✅ Found ${result.retrievedDocs.length} relevant documents`);
    console.log('Topics:', result.retrievedDocs.map(d => `${d.topic} (score: ${d.score})`).join(', '));
    console.log('\nContext Preview:');
    console.log(result.context.substring(0, 200) + '...');
  } else {
    console.log('❌ No relevant context found');
  }
});

console.log('\n' + '='.repeat(50));
console.log('RAG Test Complete!');
