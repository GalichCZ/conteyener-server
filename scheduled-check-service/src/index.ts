import express from "express";
import cors from "cors";
import "./scheduled-task/outdate-check";

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    app.listen(port, () =>
      console.log(`Scheduled check service running on port ${port}`),
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
