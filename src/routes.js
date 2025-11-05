import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';
import authMidleware from './middlewares/auth.js';
import CategoryController from './app/controllers/CategoryController.js';


const routes = new Router();

// Configuração do multer
const upload = multer({ storage: multerConfig.Storage });

// Usuários
routes.post('/users', UserController.store); // Criar usuário
routes.post('/session', SessionController.store); // Login

// Produtos
routes.use(authMidleware); // Aplica o middleware de autenticação para as rotas abaixo
routes.post('/products', upload.single('file'), ProductController.store); // Criar produto
routes.get('/products', ProductController.index); // Listar produtos
// Categorias
routes.post('/categories', CategoryController.store); // Criar categoria
routes.get('/categories', CategoryController.index); // Listar categorias

export default routes;
