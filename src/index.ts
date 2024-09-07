import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sequelize from './db/db';
import routes from './routes';
import bodyParser from 'body-parser';
import { errorHandler } from './error-handler/error-handler';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Sequelize
// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected.'))
  .catch((err) => console.log('Error: ' + err));

app.use(bodyParser.json());
// Middleware
app.use(express.json());
routes.forEach((route) => app.use('/api', route));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
