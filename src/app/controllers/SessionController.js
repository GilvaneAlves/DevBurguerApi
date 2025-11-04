import * as Yup from 'yup'; // Biblioteca de validação
import User from '../models/User.js'; // Modelo Sequelize do usuário

class SessionController {
    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        const isValid = await schema.isValid(request.body, {
            abortEarly: false,
            strict: true,
        });

        if (!isValid) {
            return response.status(400).json({ error: 'Email or password incorrect' });
        }

        const { email, password } = request.body;

        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            // Se existir, retorna erro 400 (Bad Request)
            return response.status(400).json({ error: "Email or password incorrect" });
        }

        return response.status(200).json({ ok: true });
    }
}

export default new SessionController();
