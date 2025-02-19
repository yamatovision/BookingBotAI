import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');  // srcの親ディレクトリ（backend）を指定

console.log('\n=== Environment Setup Debug ===');
console.log('1. Current directory:', __dirname);
console.log('2. Root directory:', rootDir);
console.log('3. Env file path:', resolve(rootDir, '.env'));

const result = dotenv.config({ path: resolve(rootDir, '.env') });

console.log('4. Dotenv loading result:', result.error ? 'ERROR' : 'SUCCESS');
if (result.error) {
    console.error('Dotenv error:', result.error);
}

console.log('5. Environment variables check:');
console.log('   - CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? `exists (length: ${process.env.CLAUDE_API_KEY.length})` : 'not set');
console.log('   - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('===============================\n');

export default result;