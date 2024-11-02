import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sequelize from './db/db';
import routes from './routes';
import bodyParser from 'body-parser';
import { errorHandler } from './error-handler/error-handler';
import { setUpAssociations } from './db/models/associations';
import cors from 'cors';
import './provider/elastic/indexes-init';
import { addFollowingIndexes } from './provider/elastic/migration/add-following-indexes';
import dbInit from './db/models/dbInit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Test database connection and start server
const startServer = async () => {
  try {
    if (process.env.ADD_FOLLOWING_INDEXES === 'true') {
      addFollowingIndexes();
    }
    setUpAssociations(); // Set up associations before syncing

    // Initialize the database and synchronize models
    // await dbInit(); // Call the dbInit function

    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected.');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Exit the process if initialization fails
  }
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

routes.forEach((route) => app.use('/api/test', route));

// Error handler
app.use(errorHandler);

// Start the application
startServer();
