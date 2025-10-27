import * as Yup from 'yup';
import Order from '../../app/schemas/order.js';

class OrderController {
  // Criar novo pedido
  async store(req, res) {
    const schema = Yup.object({
      user: Yup.object({
        id: Yup.string().required('ID do usuário é obrigatório'),
        name: Yup.string().required('Nome do usuário é obrigatório'),
      }).required(),
      products: Yup.array()
        .of(
          Yup.object({
            id: Yup.number().required('ID do produto é obrigatório'),
            name: Yup.string().required('Nome do produto é obrigatório'),
            price: Yup.string().required('Preço é obrigatório'),
            category: Yup.string().required('Categoria é obrigatória'),
            quantity: Yup.number()
              .positive('Quantidade deve ser positiva')
              .required('Quantidade é obrigatória'),
            url: Yup.string().required('URL é obrigatória'),
          })
        )
        .min(1, 'O pedido deve ter pelo menos um produto')
        .required('Produtos são obrigatórios'),
      status: Yup.string().required('Status é obrigatório'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { user, products, status } = req.body;

      const newOrder = await Order.create({
        user,
        products,
        status,
      });

      return res.status(201).json(newOrder);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.errors });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  // Listar todos os pedidos
  async index(_req, res) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  }

  // Atualizar status de um pedido
  async update(req, res) {
    const schema = Yup.object({
      status: Yup.string().required('Status é obrigatório'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });

      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      return res.status(200).json(updatedOrder);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.errors });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}

export default new OrderController();
