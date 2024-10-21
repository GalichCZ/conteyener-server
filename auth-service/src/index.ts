import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import client from "../providers/redis";
import dotenv from "dotenv";
import authRoutes from './routes/auth.route';

import { Request, Response } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  }),
);

app.use('/api/auth', authRoutes);

app.get('/api/auth/test/redis', async (req: Request, res: Response) => {
    const result = await client.scan('0' as any);
    const keys = result['keys']

    const allRecords: { [key: string]: string } = {};

    for (const key of keys) {
        const value = await client.get(key as any) as string;
        if (value !== null) {
            allRecords[key] = value;
        }
    }


    res.send(allRecords);
})

const startServer = async () => {
  try {
    await client.connect();
    console.log("REDIS ping: ", await client.ping());
    await mongoose.connect("mongodb://localhost:27017/auth-service").catch((e)=>console.log(e));
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
