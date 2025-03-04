import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DateType } from "../enum/date-type";
import { Following } from "../types/following";
import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { isDateOlderThanToday } from "../utils/is-date-older-than-today";

dayjs.extend(utc);
dayjs.extend(timezone);

dotenv.config();

const url = process.env.MONGO_DB || "";
const dbName = process.env.MONGO_DB_NAME;
const followingCollectionName = "items";

export const outdateMove = async () => {
  console.log("ha");
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);

    const followingCollection = db.collection<Following>(
      followingCollectionName,
    );
    const followings = await followingCollection
      .aggregate([
        {
          $match: { hidden: false },
        },
        {
          $lookup: {
            from: "deliverychannels",
            localField: "delivery_channel",
            foreignField: "_id",
            as: "deliveryChannel",
          },
        },
        {
          $unwind: {
            path: "$deliveryChannel",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    const filteredFollowings = followings.filter(
      (following) => following.deliveryChannel,
    );
    const today = dayjs().tz("Europe/Moscow").startOf("day");
    const datesToCheck = Object.values(DateType);

    for (const following of filteredFollowings) {
      let updatedFields: Partial<Record<keyof Following, string | null>> = {};

      // Find the first outdated and not updated date
      let startingDateIndex = -1;
      for (let i = 0; i < datesToCheck.length; i++) {
        const dateField = datesToCheck[i] as keyof Following;
        const updateField = `${datesToCheck[i]}_update` as keyof Following;

        if (following[dateField] && !following[updateField]) {
          const isOlderThanToday = isDateOlderThanToday(
            following[dateField],
            today.toDate(),
          );

          if (isOlderThanToday) {
            startingDateIndex = i;
            break;
          }
        }
      }

      // If we found an outdated date, update all subsequent dates
      if (startingDateIndex !== -1) {
        let currentDate = today.hour(11).minute(0).second(0).millisecond(0);

        // Start updating from the next date after the outdated one
        for (let i = startingDateIndex + 1; i < datesToCheck.length; i++) {
          const dateField = datesToCheck[i] as keyof Following;
          const deliveryDays = following.deliveryChannel?.[dateField] ?? null;

          if (deliveryDays === 0) {
            updatedFields[dateField] = null;
          } else if (deliveryDays !== null) {
            currentDate = currentDate.add(deliveryDays, "day");
            updatedFields[dateField] = currentDate.toISOString();
          }
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        await followingCollection.updateOne(
          { _id: following._id },
          { $set: updatedFields as any },
        );
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
};

cron.schedule(
  "0 1 * * *", // Every day at 1:00 AM
  () => {
    console.log('scheduled task "checkOutdate" has been executed');
    outdateMove();
  },
  { timezone: "Europe/Moscow" },
);
