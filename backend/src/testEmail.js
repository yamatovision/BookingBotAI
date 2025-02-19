import dotenv from 'dotenv';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

dotenv.config();

const redirectUri = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_REDIRECT_URI 
  : process.env.DEV_REDIRECT_URI;

console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Selected redirect URI:', redirectUri);

async function testEmailSetup() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://mail.google.com/'
      ],
      prompt: 'consent'
    });

    console.log('認証URLにアクセスしてください:');
    console.log(authUrl);
    
    // ユーザー入力待ち
    console.log('\n認証コードを入力してください:');
    process.stdin.setEncoding('utf8');
    process.stdin.resume();

    process.stdin.on('data', async (code) => {
      try {
        const { tokens } = await oauth2Client.getToken(code.trim());
        console.log('\n取得したトークン:');
        console.log(JSON.stringify(tokens, null, 2));
        process.exit(0);
      } catch (error) {
        console.error('トークン取得エラー:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
}

testEmailSetup();