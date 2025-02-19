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
    const today = new Date();
    const datesToCheck = Object.values(DateType);

    for (const following of filteredFollowings) {
      let shouldUpdate = false;
      let updatedFields: Partial<Record<keyof Following, string | null>> = {};

      for (let i = 0; i < datesToCheck.length; i++) {
        const dateField = datesToCheck[i] as keyof Following;
        const updateField = `${datesToCheck[i]}_update` as keyof Following;

        const isOlderThanToday = isDateOlderThanToday(
          following[dateField],
          today,
        );

        if (isOlderThanToday) shouldUpdate = true;

        if (shouldUpdate) {
          if (!following[updateField] && dateField !== "store_arrive_date") {
            const oldDate = following[datesToCheck[i + 1]];
            if (oldDate) {
              const deliveryDays =
                following.deliveryChannel?.[datesToCheck[i + 1]] ?? null;
              if (deliveryDays === 0) {
                updatedFields[datesToCheck[i + 1]] = null;
                continue;
              }
              const newDate = dayjs()
                .tz("Europe/Moscow")
                .add(deliveryDays, "day")
                .hour(11)
                .minute(0)
                .second(0)
                .millisecond(0);
              updatedFields[datesToCheck[i + 1]] = newDate.toISOString();
            }
          }
          if (!following[updateField] && dateField === "store_arrive_date") {
            updatedFields[dateField] = dayjs(
              new Date(following.store_arrive_date),
            )
              .add(1, "day")
              .toISOString();
          }
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        await followingCollection.updateOne(
          { _id: following._id },
          //@ts-ignore
          { $set: updatedFields },
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
  "0 5 * * *", // Every day at 5:00 AM
  () => {
    console.log('scheduled task "checkOutdate" has been executed');
    outdateMove();
  },
  { timezone: "Europe/Moscow" },
);
