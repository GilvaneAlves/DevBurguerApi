import * as Yup from 'yup';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

class ProductController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().trim().required('Nome é obrigatório'),
      price: Yup.number()
        .typeError('Preço deve ser numérico')
        .positive('Preço deve ser positivo')
        .required('Preço é obrigatório'),
      category_id: Yup.number()
        .typeError('Categoria inválida')
        .integer('Categoria inválida')
        .required('Categoria é obrigatória'),
      offer: Yup.boolean().optional(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false, stripUnknown: true });

      const { name, price, category_id, offer } = req.body;

      if (!req.file?.filename) {
        return res.status(400).json({ error: 'Product image is mandatory.' });
      }

      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: 'Category not found.' });
      }

      const newProduct = await Product.create({
        name,
        price,
        category_id,
        path: req.file.filename,
        offer: offer ?? false,
      });

      return res.status(201).json(newProduct);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.errors });
      }
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    const paramsSchema = Yup.object({
      id: Yup.number()
        .typeError('ID inválido')
        .integer('ID inválido')
        .required('ID é obrigatório'),
    });

    const bodySchema = Yup.object({
      name: Yup.string().trim(),
      price: Yup.number()
        .typeError('Preço deve ser numérico')
        .positive('Preço deve ser positivo'),
      category_id: Yup.number()
        .typeError('Categoria inválida')
        .integer('Categoria inválida'),
      offer: Yup.boolean(),
    }).noUnknown(true, 'Campo não permitido: ${unknown}');

    try {
      await paramsSchema.validate(req.params, { abortEarly: false });
      await bodySchema.validate(req.body, { abortEarly: false });

      const { id } = req.params;
      const { name, price, category_id, offer } = req.body;

      // 1) Verifica se o produto existe
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      // 2) Se category_id foi enviado, valida a categoria
      if (category_id != null) {
        const category = await Category.findByPk(category_id);
        if (!category) {
          return res.status(400).json({ error: 'Category not found.' });
        }
      }

      // 3) Mantém imagem atual se nenhuma nova foi enviada
      const nextPath = req.file?.filename ?? product.path;

      // 4) Atualiza os campos informados
      await product.update({
        name: name ?? product.name,
        price: price ?? product.price,
        category_id: category_id ?? product.category_id,
        path: nextPath,
        offer: offer ?? product.offer,
      });

      return res.status(200).json(product);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.errors });
      }
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async index(_req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [['id', 'DESC']],
      });

      return res.status(200).json(products);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProductController();