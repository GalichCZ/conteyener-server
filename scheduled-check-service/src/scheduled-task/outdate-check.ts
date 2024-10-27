import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { RottenData } from "../types/rotten-data";
import { OutDate } from "../types/out-date";
import { notifyOutDate } from "../api/notify-out-date";
import { isDateOlderThanToday } from "../utils/is-date-older-than-today";
import { DateType } from "../enum/date-type";
import { Following } from "../types/following";
import cron from "node-cron";

dotenv.config();

const url = process.env.MONGO_DB || "";
const dbName = process.env.MONGO_DB_NAME;
const followingCollectionName = "items";
const usersCollection = "users";

export const checkOutdate = async () => {
  const client = new MongoClient(url);
  try {
    await client.connect();

    const db = client.db(dbName);

    const followingCollection = db.collection<Following>(
      followingCollectionName,
    );
    const followings = await followingCollection
      .find<Following>({ hidden: false })
      .toArray();

    const today = new Date();
    const datesToCheck = Object.values(DateType);

    const rotten_data: RottenData = [];

    for (const following of followings) {
      const checkedDates: OutDate[] = [];
      datesToCheck.forEach((dateType) => {
        const date = following[dateType];
        const isUpdated =
          following[(dateType + "_update") as keyof typeof following];
        if (isUpdated) {
          return;
        }
        const isOlderThanToday = isDateOlderThanToday(date, today);
        if (isOlderThanToday) {
          checkedDates.push({
            date_type: dateType,
            date: date,
          });
        }
      });
      if (checkedDates.length > 0) {
        rotten_data.push({
          _id: following._id,
          container_number: following.container_number,
          out_dates: checkedDates,
        });
      }
    }

    if (rotten_data.length > 0) {
      const usersToNotify = await db
        .collection(usersCollection)
        .find<{ email: string }>({ role: "manager_int" })
        .toArray();
      const emails = usersToNotify.map((user) => user.email);
      notifyOutDate(emails, rotten_data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
};

cron.schedule(
  // "* * * * *", // every minute
  "0 8,20 * * *", // every day at 8:00 and 20:00
  () => {
    console.log('scheduled task "checkOutdate" has been executed');
    checkOutdate();
  },
  { timezone: "Europe/Moscow" },
);
