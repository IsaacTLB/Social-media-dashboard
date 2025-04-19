// scripts/generate-env.js
import fs from 'fs';
import crypto from 'crypto';

const envFile = '.env';
const key = crypto.randomBytes(64).toString('hex');
const secretKeyLine = `SECRET_ACCESS_TOKEN=${key}\n`;

// Read existing .env content or create new one
let content = '';
if (fs.existsSync(envFile)) {
  content = fs.readFileSync(envFile, 'utf-8');
  // Check if key already exists
  if (content.includes('SECRET_ACCESS_TOKEN=')) {
    console.log('SECRET_ACCESS_TOKEN already exists in .env');
    process.exit(0);
  }
}

// Append or create the new line
fs.appendFileSync(envFile, secretKeyLine);
console.log('✅ SECRET_ACCESS_TOKEN added to .env');
