import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
    async store(request, response) {
        console.log("req.body:", request.body);
        console.log("req.file:", request.file);

        const schema = Yup.object({
            name: Yup.string().required(),
        });

        try {
            await schema.validateSync(request.body, { abortEarly: false });
        } catch (validationError) {
            return response.status(400).json({ error: validationError.errors });
        }

        if (!request.file) {
            return response.status(400).json({ error: "File is required" });
        }

        const { name } = request.body;
        const { filename } = request.file;


        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return response.status(400).json({ error: 'Category already exists.' });
        }

        const newCategory = await Category.create({
            name,
            path: filename,
        });

        return response.status(201).json({ newCategory });
    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (validationError) {
            return response.status(400).json({ error: validationError.errors });
        }

        const { name } = request.body;
        const { id } = request.params;

        let path;

        if (request.file) {
            const { filename } = request.file;
            path = filename;
        }
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return response.status(400).json({ error: 'Category already exists.' });
        }

        await Category.update({
            name,
            path,
        },
            {
                where: { id }
            });

        return response.status(201).json();
    }

    async index(request, response) {
        const categories = await Category.findAll();
        return response.status(200).json(categories);
    }
}

export default new CategoryController();
