import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';

dotenv.config();

const elasticClient = new Client({
  node: process.env.ELASTIC_URL || 'http://localhost:9200',
});

export default elasticClient;
