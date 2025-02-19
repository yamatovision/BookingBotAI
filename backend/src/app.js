import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

console.log('\n=== Environment Setup Debug ===');
console.log('1. Current directory:', __dirname);
console.log('2. Root directory:', rootDir);
console.log('3. Env file path:', resolve(rootDir, '.env'));

// dotenvの設定前のCLAUDE_API_KEY
console.log('4. CLAUDE_API_KEY before dotenv:', process.env.CLAUDE_API_KEY || 'not set');

// dotenvの設定
const result = dotenv.config({ path: resolve(rootDir, '.env') });

console.log('5. Dotenv config result:', result.error ? 'Error loading .env' : 'Successfully loaded .env');
if (result.error) {
    console.error('Dotenv error:', result.error);
}

console.log('6. Loaded environment variables:');
console.log('   - CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? `exists (length: ${process.env.CLAUDE_API_KEY.length})` : 'not set');
console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? 'exists' : 'not set');
console.log('   - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('===========================\n');

// 残りのインポート
import './config/env.js';

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import claudeRoutes from './modules/claude/claude.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import emailRoutes from './modules/email/email.routes.js';  // 追加
import { emailController } from './modules/email/email.controller.js';  // 追加

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/claude', claudeRoutes);


app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/email', emailRoutes);  // 追加：emailルートを登録
app.get('/oauth2callback', emailController.handleOAuth2Callback);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
