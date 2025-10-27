// Importações
import { Router } from 'express';
import multer from 'multer';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import authMiddleware from './middlewares/auth.js';

import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';
import multerConfig from './config/multer.js';
import adminMiddleware from './middlewares/admin.js';

// Instâncias
const routes = new Router();
const upload = multer(multerConfig);

// Rotas de usuário
routes.post('/users', UserController.store);         // Cadastro
routes.post('/session', SessionController.store);    // Login

// Rotas de produtos
routes.use(authMiddleware); // A partir daqui, precisa de token

routes.post('/products', adminMiddleware, upload.single('file'), ProductController.store); // Criação com upload
routes.put('/products/:id', adminMiddleware, upload.single('file'), ProductController.update);
 // Atualiza
routes.get('/products', ProductController.index);                         // Listagem

routes.post('/categories', adminMiddleware, upload.single('file'), CategoryController.store); 
routes.put('/categories/:id', adminMiddleware, upload.single('file'), CategoryController.update); 
routes.get('/categories', CategoryController.index); 



routes.post('/orders', adminMiddleware, OrderController.store); 

// Exporta as rotas
export default routes;
