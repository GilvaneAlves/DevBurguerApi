import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import User from '../models/User.js';

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required('Name is required.'),
      email: Yup.string().email('Invalid email format.').required('Email is required.'),
      password: Yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
      admin: Yup.boolean(),
    });

    try {
      // 🔍 Validate request data
      await schema.validate(req.body, { abortEarly: false, strict: true });

      const { name, email, password, admin } = req.body;

      // 📧 Check for existing user
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }

      // 🔐 Hash password
      const password_hash = await bcrypt.hash(password, 8);

      // 👤 Create user
      const user = await User.create({
        id: uuidv4(),
        name,
        email,
        password_hash,
        admin: admin ?? false,
      });

      // ✅ Respond with safe user data
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          error: 'Validation failed.',
          messages: error.errors,
        });
      }

      console.error(error);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
  }
}

export default new UserController();
