import { MongoClient } from "mongodb";
import { createClient } from "redis";
import cron from "node-cron";

interface ContainerStats {
  totalInTransit: number;
  readyForPickupInMoscow: number;
  inTransitByRailRF: number;
  inPortOrArrivingToPort: number;
  inTransitBySeaRoute: number;
  inTransitByDirectRail: number;
  inTransitByDirectAuto: number;
  hasCustomsDeclarationWaitingForSubmission: number;
  customsDeclarationIssued: number;
}

interface ContainerStatsWithIds extends ContainerStats {
  totalInTransitIds: string[];
  readyForPickupInMoscowIds: string[];
  inTransitByRailRFIds: string[];
  inPortOrArrivingToPortIds: string[];
  inTransitBySeaRouteIds: string[];
  inTransitByDirectRailIds: string[];
  inTransitByDirectAutoIds: string[];
  hasCustomsDeclarationWaitingForSubmissionIds: string[];
  customsDeclarationIssuedIds: string[];
}

const REDIS_KEYS = {
  TOTAL_IN_TRANSIT: "stats:total_in_transit",
  READY_FOR_PICKUP: "stats:ready_for_pickup",
  IN_TRANSIT_BY_RAIL: "stats:in_transit_by_rail",
  IN_PORT: "stats:in_port",
  IN_TRANSIT_BY_SEA: "stats:in_transit_by_sea",
  IN_TRANSIT_BY_DIRECT_RAIL: "stats:in_transit_by_direct_rail",
  IN_TRANSIT_BY_AUTO: "stats:in_transit_by_auto",
  HAS_CUSTOMS_DECLARATION: "stats:has_customs_declaration",
  CUSTOMS_DECLARATION_ISSUED: "stats:customs_declaration_issued",
} as const;

const REDIS_ID_SETS = {
  TOTAL_IN_TRANSIT: "stats:total_in_transit:ids",
  READY_FOR_PICKUP: "stats:ready_for_pickup:ids",
  IN_TRANSIT_BY_RAIL: "stats:in_transit_by_rail:ids",
  IN_PORT: "stats:in_port:ids",
  IN_TRANSIT_BY_SEA: "stats:in_transit_by_sea:ids",
  IN_TRANSIT_BY_DIRECT_RAIL: "stats:in_transit_by_direct_rail:ids",
  IN_TRANSIT_BY_AUTO: "stats:in_transit_by_auto:ids",
  HAS_CUSTOMS_DECLARATION: "stats:has_customs_declaration:ids",
  CUSTOMS_DECLARATION_ISSUED: "stats:customs_declaration_issued:ids",
} as const;

const url = process.env.MONGO_DB || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME || "test";
const followingCollectionName = "items";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

export const getContainerStats = async (): Promise<ContainerStatsWithIds> => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    await redisClient.connect();

    const db = client.db(dbName);
    const collection = db.collection(followingCollectionName);

    // Helper function to get both count and IDs
    const getCountAndIds = async (query: any) => {
      const cursor = collection.find(query, { projection: { _id: 1 } });
      const documents = await cursor.toArray();
      const ids = documents.map((doc) => doc._id.toString());
      return { count: documents.length, ids };
    };

    // 1. Total in transit
    const { count: totalInTransit, ids: totalInTransitIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        hidden: false,
      });

    // 2. Ready for pickup in Moscow
    const { count: readyForPickupInMoscow, ids: readyForPickupInMoscowIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        declaration_issue_date_update: true,
        hidden: false,
        "km_to_dist.km_to_dist": "0",
        "km_to_dist.dist_was_updated": true,
      });

    // 3. In transit by rail in RF
    const { count: inTransitByRailRF, ids: inTransitByRailRFIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        "km_to_dist.km_to_dist": { $ne: "0" },
        "km_to_dist.dist_was_updated": true,
        hidden: false,
      });

    // 4. In port or arriving to port
    const { count: inPortOrArrivingToPort, ids: inPortOrArrivingToPortIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        etd: { $ne: null },
        train_depart_date_update: false,
        hidden: false,
      });

    // 5. In transit by sea route (VLD/SPB/NVR)
    const { count: inTransitBySeaRoute, ids: inTransitBySeaRouteIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        delivery_method: "Море",
        hidden: false,
      });

    // 6. In transit by direct rail
    const { count: inTransitByDirectRail, ids: inTransitByDirectRailIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        delivery_method: "Поезд",
        hidden: false,
      });

    // 7. In transit by direct auto
    const { count: inTransitByDirectAuto, ids: inTransitByDirectAutoIds } =
      await getCountAndIds({
        container_number: { $ne: null },
        store_arrive_date_update: false,
        delivery_method: "Авто",
        hidden: false,
      });

    // 8. Has customs declaration, waiting for submission
    const {
      count: hasCustomsDeclarationWaitingForSubmission,
      ids: hasCustomsDeclarationWaitingForSubmissionIds,
    } = await getCountAndIds({
      container_number: { $ne: null },
      store_arrive_date_update: false,
      date_do_update: true,
      declaration_issue_date_update: false,
      hidden: false,
    });

    // 9. Customs declaration issued
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const {
      count: customsDeclarationIssued,
      ids: customsDeclarationIssuedIds,
    } = await getCountAndIds({
      container_number: { $ne: null },
      store_arrive_date_update: false,
      declaration_issue_date: {
        $gte: today,
        $lt: tomorrow,
      },
      declaration_issue_date_update: true,
      hidden: false,
    });

    // First clean all existing Redis keys before setting new values
    const cleanupPipeline = redisClient.multi();

    // Delete all counter keys
    Object.values(REDIS_KEYS).forEach((key) => {
      cleanupPipeline.del(key);
    });

    // Delete all ID sets
    Object.values(REDIS_ID_SETS).forEach((key) => {
      cleanupPipeline.del(key);
    });

    // Execute cleanup
    await cleanupPipeline.exec();
    console.log("Cleaned up existing Redis keys");

    // Save counts to Redis
    const pipeline = redisClient.multi();

    pipeline
      .set(REDIS_KEYS.TOTAL_IN_TRANSIT, totalInTransit)
      .set(REDIS_KEYS.READY_FOR_PICKUP, readyForPickupInMoscow)
      .set(REDIS_KEYS.IN_TRANSIT_BY_RAIL, inTransitByRailRF)
      .set(REDIS_KEYS.IN_PORT, inPortOrArrivingToPort)
      .set(REDIS_KEYS.IN_TRANSIT_BY_SEA, inTransitBySeaRoute)
      .set(REDIS_KEYS.IN_TRANSIT_BY_DIRECT_RAIL, inTransitByDirectRail)
      .set(REDIS_KEYS.IN_TRANSIT_BY_AUTO, inTransitByDirectAuto)
      .set(
        REDIS_KEYS.HAS_CUSTOMS_DECLARATION,
        hasCustomsDeclarationWaitingForSubmission,
      )
      .set(REDIS_KEYS.CUSTOMS_DECLARATION_ISSUED, customsDeclarationIssued);

    // Save IDs to Redis sets
    if (totalInTransitIds.length)
      pipeline.sAdd(REDIS_ID_SETS.TOTAL_IN_TRANSIT, totalInTransitIds);
    if (readyForPickupInMoscowIds.length)
      pipeline.sAdd(REDIS_ID_SETS.READY_FOR_PICKUP, readyForPickupInMoscowIds);
    if (inTransitByRailRFIds.length)
      pipeline.sAdd(REDIS_ID_SETS.IN_TRANSIT_BY_RAIL, inTransitByRailRFIds);
    if (inPortOrArrivingToPortIds.length)
      pipeline.sAdd(REDIS_ID_SETS.IN_PORT, inPortOrArrivingToPortIds);
    if (inTransitBySeaRouteIds.length)
      pipeline.sAdd(REDIS_ID_SETS.IN_TRANSIT_BY_SEA, inTransitBySeaRouteIds);
    if (inTransitByDirectRailIds.length)
      pipeline.sAdd(
        REDIS_ID_SETS.IN_TRANSIT_BY_DIRECT_RAIL,
        inTransitByDirectRailIds,
      );
    if (inTransitByDirectAutoIds.length)
      pipeline.sAdd(REDIS_ID_SETS.IN_TRANSIT_BY_AUTO, inTransitByDirectAutoIds);
    if (hasCustomsDeclarationWaitingForSubmissionIds.length)
      pipeline.sAdd(
        REDIS_ID_SETS.HAS_CUSTOMS_DECLARATION,
        hasCustomsDeclarationWaitingForSubmissionIds,
      );
    if (customsDeclarationIssuedIds.length)
      pipeline.sAdd(
        REDIS_ID_SETS.CUSTOMS_DECLARATION_ISSUED,
        customsDeclarationIssuedIds,
      );

    // Execute all Redis commands in pipeline
    await pipeline.exec();

    console.log({
      totalInTransit,
      readyForPickupInMoscow,
      inTransitByRailRF,
      inPortOrArrivingToPort,
      inTransitBySeaRoute,
      inTransitByDirectRail,
      inTransitByDirectAuto,
      hasCustomsDeclarationWaitingForSubmission,
      customsDeclarationIssued,
      totalInTransitIds,
      readyForPickupInMoscowIds,
      inTransitByRailRFIds,
      inPortOrArrivingToPortIds,
      inTransitBySeaRouteIds,
      inTransitByDirectRailIds,
      inTransitByDirectAutoIds,
      hasCustomsDeclarationWaitingForSubmissionIds,
      customsDeclarationIssuedIds,
    });

    return {
      totalInTransit,
      readyForPickupInMoscow,
      inTransitByRailRF,
      inPortOrArrivingToPort,
      inTransitBySeaRoute,
      inTransitByDirectRail,
      inTransitByDirectAuto,
      hasCustomsDeclarationWaitingForSubmission,
      customsDeclarationIssued,
      totalInTransitIds,
      readyForPickupInMoscowIds,
      inTransitByRailRFIds,
      inPortOrArrivingToPortIds,
      inTransitBySeaRouteIds,
      inTransitByDirectRailIds,
      inTransitByDirectAutoIds,
      hasCustomsDeclarationWaitingForSubmissionIds,
      customsDeclarationIssuedIds,
    };
  } finally {
    await client.close();
    await redisClient.quit();
  }
};

cron.schedule(
  "0 12 * * *", // Every day at 12:00 PM
  () => {
    console.log('scheduled task "getContainerStats" has been executed');
    getContainerStats();
  },
  { timezone: "Europe/Moscow" },
);
