import { v4 } from 'uuid'; // Para gerar IDs únicos (UUID)
import * as Yup from 'yup'; // Biblioteca de validação
import User from '../models/User.js'; // Modelo Sequelize do usuário
import bcrypt from 'bcryptjs'; // Para criptografar a senha

class UserController {
  async store(request, response) {
    try {
      // 1️⃣ Verifica se já existe um usuário com o mesmo e-mail
      const existingUser = await User.findOne({
        where: { email: request.body.email },
      });

      if (existingUser) {
        // Se existir, retorna erro 400 (Bad Request)
        return response.status(400).json({ error: 'Email already taken!' });
      }

      // 2️⃣ Define o esquema de validação usando Yup
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'), // Deve ser string e obrigatório
        email: Yup.string().email('Invalid email').required('Email is required'), // Deve ser e-mail válido e obrigatório
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'), // Mínimo 6 caracteres e obrigatório
        admin: Yup.boolean(), // Booleano, opcional
      });

      // 3️⃣ Valida os dados da requisição
      try {
        schema.validateSync(request.body, { abortEarly: false, strict: true });
        // abortEarly: false -> retorna todos os erros, não apenas o primeiro
        // strict: true -> não faz coerção automática de tipos
      } catch (validationError) {
        // Se houver erro de validação, retorna 400 com lista de erros
        return response.status(400).json({ error: validationError.errors });
      }

      // 4️⃣ Extrai os campos do corpo da requisição
      const { name, email, password, admin } = request.body;

      // 5️⃣ Criptografa a senha usando bcrypt
      const password_hash = await bcrypt.hash(password, 8);

      // 6️⃣ Cria o usuário no banco de dados
      const user = await User.create({
        id: v4(), // Gera UUID manualmente
        name,
        email,
        password_hash,
        admin,
      });

      // 7️⃣ Retorna o usuário criado (sem a senha) com status 201
      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });
    } catch (error) {
      // 8️⃣ Captura qualquer erro inesperado e retorna 500
      console.error(error);
      return response.status(500).json({ error: 'Error creating user' });
    }
  }
}

export default new UserController();
