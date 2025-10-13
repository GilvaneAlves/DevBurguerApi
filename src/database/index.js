import { Sequelize } from "sequelize";
import Product from "../app/models/Product.js";
import User from "../app/models/User.js";
import databaseConfig from "../config/database.cjs";


const models =[User, Product]


class Database {
  constructor() {
    this.init();
  }
  init(){
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }
}
export default new Database();