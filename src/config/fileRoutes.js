import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// recria __dirname no modo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = resolve(__dirname, '..', '..', 'uploads');
const fileRoutConfig = express.static(uploadPath);

export default fileRoutConfig;
