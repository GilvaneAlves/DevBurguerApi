// Importações
import * as Yup from 'yup'; // Biblioteca para validação de dados
import Category from '../models/Category.js'; // Modelo Sequelize da tabela Category

class CategoryController {
  // ===============================
  // Criar nova categoria
  // ===============================
  async store(req, res) {
    // Validação dos dados de entrada
    const schema = Yup.object({
      name: Yup.string().required('Category name is required.'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      // Retorna erro de validação
      return res.status(400).json({
        error: 'Validation failed',
        messages: err.errors,
      });
    }

    const { name } = req.body;
    const filename = req.file ? req.file.filename : null; // Evita erro se não vier arquivo

    // Verificar se a categoria já existe
    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'This category already exists' });
    }

    // Criar nova categoria no banco
    const newCategory = await Category.create({
      name,
      path: filename,
    });

    // Retorna a categoria criada
    return res.status(201).json(newCategory);
  }

  // ===============================
  // Atualizar categoria existente
  // ===============================
  async update(req, res) {
    // Validação opcional do nome
    const schema = Yup.object({
      name: Yup.string(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      // Retorna erro de validação
      return res.status(400).json({
        error: 'Validation failed',
        messages: err.errors,
      });
    }

    const { name } = req.body;
    const { id } = req.params;
    let path = null;

    // Se foi enviado novo arquivo, captura o nome
    if (req.file) {
      path = req.file.filename;
    }

    // Se o nome foi informado, verifica se já existe outra categoria igual
    if (name) {
      const existingCategory = await Category.findOne({
        where: { name },
      });

      // Se encontrar e não for a mesma categoria, retorna erro
      if (existingCategory && existingCategory.id != id) {
        return res.status(400).json({ error: 'This category already exists' });
      }
    }

    // Atualiza os dados da categoria
    await Category.update(
      {
        name,
        path,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({ message: 'Category updated successfully' });
  }

  // ===============================
  // Listar todas as categorias
  // ===============================
  async index(_req, res) {
    // Busca todas as categorias em ordem crescente de ID
    const categories = await Category.findAll({
      order: [['id', 'ASC']],
    });

    // Retorna lista
    return res.status(200).json(categories);
  }
}

// Exporta uma instância única do controller
export default new CategoryController();
