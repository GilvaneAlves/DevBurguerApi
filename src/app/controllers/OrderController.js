import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js';

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

        const mappedProducts = findedProducts.map((product) => {
            const quantity = products.find((p) => p.id === product.id).quantity;
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                url: product.url,
                category: product.category.name,
                quantity,
            };
        });

        const order = {
            user: {
                id: userId,
                name: userName,
            },
            products: mappedProducts,
            status: 'Order successfully placed!',
        };

        const newOrder = await Order.create(order);
        return response.status(201).json(newOrder);
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false, strict: true });
        } catch (validationError) {
            return response.status(400).json({ error: validationError.errors });
        }

        const { status } = request.body;
        const { id } = request.params;

        try {
            const result = await Order.updateOne({ _id: id }, { status });

            if (result.matchedCount === 0) {
                return response.status(404).json({ error: 'Order not found' });
            }
        } catch (err) {
            return response.status(500).json({ error: 'Failed to update order status' });
        }

        return response.status(200).json({ message: 'Order status updated successfully' });
    }

    async index(_request, response) {
        const orders = await Order.find();
        return response.status(200).json(orders);
    }
}

export default new OrderController();
