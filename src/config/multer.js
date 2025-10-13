import multer from 'multer';
import fs from 'fs';
import { resolve } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

// Caminho completo para a pasta de uploads
const uploadDir = resolve('uploads');

// Cria a pasta 'uploads' se ela ainda não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    callback(null, uniqueName);
  }
});

export default {
  storage
};
