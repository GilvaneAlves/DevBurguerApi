import * as Yup from 'yup'; // Biblioteca de validação
import Category from '../models/Category.js';

class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
        });


        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (validationError) {
            return response.status(400).json({ error: validationError.errors });
        }

        const { name } = request.body;

        const exinstingCategory = await Category.findOne({ where: { name } });

        if (exinstingCategory) {
            return response.status(400).json({ error: 'Category already exists.' });
        }

        const newCategoty = await Category.create({
            name,
        });


        return response.status(201).json({ newCategoty });
    }

    async index(request, response) {
        const categories = await Category.findAll();

        console.log(request.userId);

        return response.status(200).json(categories);
    }
}

export default new CategoryController();