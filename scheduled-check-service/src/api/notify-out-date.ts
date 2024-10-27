import axios from "axios";
import dotenv from "dotenv";
import { RottenData } from "../types/rotten-data";

dotenv.config();

const url = process.env.MAIL_SERVICE || "";

export const notifyOutDate = (emails: string[], rotten_data: RottenData) => {
  axios
    .post(url + "/out-date-notification", { emails, rotten_data })
    .catch((e) => console.log(e));
};
