import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MAIL_SERVICE || "";

export const testMail = () => {
  axios.get(url + "/test").catch((e) => console.log(e));
};
