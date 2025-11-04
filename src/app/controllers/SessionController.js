import * as Yup from 'yup'; // Biblioteca de validação
import User from '../models/User.js'; // Modelo Sequelize do usuário
import bcrypt from 'bcryptjs'; // Para criptografar a senha

class SessionController {
    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

        const isValid = await schema.isValid(request.body, {
            abortEarly: false,
            strict: true,
        });

        const emailOrPasswordIncorrect = () => {
            return response.status(400).json({ error: 'Email or password incorrect' });
        }


        if (!isValid) {
            return emailOrPasswordIncorrect();
        }

        const { email, password } = request.body;

        const existingUser = await User.findOne({
            where: { email },
        });

        if (!existingUser) {
            return emailOrPasswordIncorrect();
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);

        if (!isPasswordValid) {
            return emailOrPasswordIncorrect();
        }

        // Se chegou aqui, login foi bem-sucedido
        return response.status(200).json({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            admin: existingUser.admin,
        });
    }
}

export default new SessionController();
