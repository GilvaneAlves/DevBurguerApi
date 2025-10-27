import { DataTypes, Model, Sequelize } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        path: Sequelize.STRING,
         url: {
          type: DataTypes.VIRTUAL,
          get() {
            return `http://localhost:3001/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'categories',
        modelName: 'Category',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products',
    });
  }
}

export default Category;
