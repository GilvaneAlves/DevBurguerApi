import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array()
                .of(
                    Yup.object({
                        id: Yup.number().required(),
                        quantity: Yup.number().required(),
                    })
                )
                .required(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false, strict: true });
        } catch (validationError) {
            return response.status(400).json({ error: validationError.errors });
        }

        const { userId, userName } = request;
        const { products } = request.body;

        const productIds = products.map((product) => product.id);

        const findedProducts = await Product.findAll({
            where: { id: productIds },
            include: {
                model: Category,
                as: 'category',
                attributes: ['name'],
            },
        });

        const mappedProducts = findedProducts.map(product => {
            const quantity = products.find(p => p.id === product.id).quantity;
            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                url: product.url,
                category: product.category.name,
                quantity,
            };
            return newProduct;
        });

        const order = {
            user: {
                id: userId,
                name: userName,
            },
            products: mappedProducts,
            status: 'Order successfully placed!',
        };

        return response.status(201).json(order);
    }
}

export default new OrderController();
