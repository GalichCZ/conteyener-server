import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response } from "express";
import routes from "./router";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!\n MAILER");
});

const startServer = async () => {
    try {
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

routes.forEach((route) => app.use("/api/mail", route));

startServer();