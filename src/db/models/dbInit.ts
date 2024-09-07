import * as Models from './index';

const isDev = (process.env.DB_ALTER || 'development') === 'development';

const dbInit = () => {
  Object.values(Models).map((model) => {
    model.sync({ alter: isDev });
  });
};

export default dbInit;
