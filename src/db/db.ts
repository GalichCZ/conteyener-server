import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 5432,
});

export default sequelize;
