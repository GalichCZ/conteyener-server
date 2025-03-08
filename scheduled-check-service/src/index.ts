import express from "express";
import cors from "cors";
import "./scheduled-task/outdate-check";
import client from "./providers/redis";
import { getContainerStats } from "./scheduled-task/stats-update";
import { outdateMove } from "./scheduled-task/outdate-move";

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await client.connect();
    console.log("Redis connected successfully");

    app.listen(port, () =>
      console.log(`Scheduled check service running on port ${port}`),
    );
    await outdateMove();
    // await populateTestData();
    await getContainerStats();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
