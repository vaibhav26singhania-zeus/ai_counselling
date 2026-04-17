import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_API = process.env.OLLAMA_API || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'qwen3.5:1b';

async function testOllama() {
  console.log('Testing Ollama connection...\n');
  
  try {
    // Test 1: Check if Ollama is running
    console.log('1. Checking Ollama server...');
    const healthCheck = await axios.get(`${OLLAMA_API}/api/tags`);
    console.log('✓ Ollama server is running');
    
    // Test 2: Check if model is available
    console.log('\n2. Checking available models...');
    const models = healthCheck.data.models || [];
    console.log('Available models:', models.map(m => m.name).join(', '));
    
    const hasQwen = models.some(m => m.name.includes('qwen'));
    if (hasQwen) {
      console.log('✓ Qwen model found');
    } else {
      console.log('⚠ Qwen model not found. Run: ollama pull qwen2.5:1.5b');
    }
    
    // Test 3: Try generating a response
    console.log('\n3. Testing model generation...');
    const response = await axios.post(`${OLLAMA_API}/api/generate`, {
      model: MODEL_NAME,
      prompt: 'What is SIP in finance? Answer in one sentence.',
      stream: false,
      options: {
        temperature: 0.7,
      }
    });
    
    console.log('✓ Model response:', response.data.response.trim());
    console.log('\n✅ All tests passed! Your setup is ready.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\nOllama server is not running. Please start it with:');
      console.log('  ollama serve');
    } else if (error.response?.status === 404) {
      console.log('\nModel not found. Please pull it with:');
      console.log(`  ollama pull ${MODEL_NAME}`);
    }
  }
}

testOllama();
