import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';
import authMidleware from './app/middlewares/auth.js';
import CategoryController from './app/controllers/CategoryController.js';
import adminMiddleware from './app/middlewares/admin.js';
import OrderController from './app/controllers/OrderController.js';

const routes = new Router();

// Configuração do multer
const upload = multer({ storage: multerConfig.Storage });

// Usuários
routes.post('/users', UserController.store); // Criar usuário
routes.post('/sessions', SessionController.store); // Login

// Produtos
routes.use(authMidleware); // Aplica o middleware de autenticação para as rotas abaixo
routes.post('/products', adminMiddleware, upload.single('file'), ProductController.store); // Criar produto
routes.put('/products/:id', adminMiddleware, upload.single('file'), ProductController.update); // Atualizar produto
routes.get('/products', ProductController.index); // Listar produtos

// Categorias
routes.post('/categories', adminMiddleware, upload.single('file'), CategoryController.store); // Criar categoria
routes.put('/categories/:id', adminMiddleware, upload.single('file'), CategoryController.update); // Atualizar categoria
routes.get('/categories', CategoryController.index); // Listar categorias

// Pedidos
routes.post('/orders', OrderController.store); // Criar pedido
routes.get('/orders', OrderController.index); // Listar pedidos
routes.put('/orders/:id', adminMiddleware, OrderController.update); // Atualizar pedido

export default routes;
