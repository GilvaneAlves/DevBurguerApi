import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import Category from '../app/models/Category.js';
import Product from '../app/models/Product.js';
import User from '../app/models/User.js'; // <-- importe o User aqui
import configDatabase from '../config/database.js';

// Inclua o User na lista de models
const models = [User, Product, Category];

class Database {
  constructor() {
    this.connection = new Sequelize(configDatabase);
    this.init();
    this.mongo();
  }

  init() {
    models
      .map((model) => {
        console.log('🔹 Inicializando model:', model?.name || model);
        return model?.init ? model.init(this.connection) : undefined;
      })
      .map((model) => {
        if (model?.associate) {
          console.log('🔸 Associando model:', model.name);
          model.associate(this.connection.models);
        } else {
          console.log('⚠️  Model sem associate:', model?.name || model);
        }
        return model;
      });
  }
  mongo(){
    this.mongooseConection = mongoose.connect('mongodb://localhost:27017/devburguer')
  }
}

export default new Database();
