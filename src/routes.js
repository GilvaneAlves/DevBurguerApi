// Importações
import { Router } from 'express';
import multer from 'multer';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import authMiddleware from './middlewares/auth.js';

import multerConfig from './config/multer.js';

// Instâncias
const routes = new Router();
const upload = multer(multerConfig);

// Rotas de usuário
routes.post('/users', UserController.store);         // Cadastro
routes.post('/session', SessionController.store);    // Login

// Rotas de produtos
routes.use(authMiddleware); // A partir daqui, precisa de token

routes.post('/products', upload.single('file'), ProductController.store); // Criação com upload
routes.get('/products', ProductController.index);                         // Listagem

// Exporta as rotas
export default routes;
