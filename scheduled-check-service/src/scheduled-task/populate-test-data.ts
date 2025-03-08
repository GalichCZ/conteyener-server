import { MongoClient, ObjectId } from 'mongodb';

const url = process.env.MONGO_DB || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME || "test";
const followingCollectionName = "items";

interface Item {
  _id: ObjectId;
  request_date: Date | null;
  product: ObjectId[];
  inside_number: string[] | null;
  proform_number: string[] | null;
  order_number: object[];
  container_number: string | null;
  container_type: string;
  simple_product_name: string[];
  providers: any[];
  importers: any[];
  conditions: any[];
  direction: string;
  store_name: string;
  store: ObjectId | null;
  provider: ObjectId[];
  delivery_channel: ObjectId | null;
  agent: string;
  added_products_list: any[];
  place_of_dispatch: string;
  delivery_method: string;
  line: string;
  ready_date: Date | null;
  load_date: Date | null;
  etd: Date | null;
  eta: Date | null;
  eta_update: boolean;
  release: Date | null;
  bl_smgs_cmr: boolean;
  td: boolean;
  date_do: Date | null;
  date_do_update: boolean;
  port: string;
  is_ds: boolean;
  fraht_account: string;
  is_docs: object[];
  declaration_number: string[];
  declaration_issue_date: Date | null;
  declaration_issue_date_update: boolean;
  declaration_status: any[];
  availability_of_ob: Date | null;
  answer_of_ob: Date | null;
  expeditor: string;
  destination_station: string;
  km_to_dist: object | null;
  train_depart_date: Date | null;
  train_depart_date_update: boolean;
  train_arrive_date: Date | null;
  train_arrive_date_update: boolean;
  pickup: string;
  store_arrive_date: Date | null;
  store_arrive_date_update: boolean;
  stock_place: ObjectId | null;
  stock_place_name: string;
  fraht: string;
  bid: number;
  note: string;
  creator: ObjectId | null;
  updator: ObjectId | null;
  hidden: boolean;
  latest_comment: string;
  latest_comment_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const generateTestData = (): Item[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const baseItem: Item = {
    _id: new ObjectId(),
    request_date: today,
    product: [new ObjectId(), new ObjectId()],
    inside_number: ["IN001", "IN002"],
    proform_number: ["PF001", "PF002"],
    order_number: [{ name: "ORD001", index: "SUB001" }],
    container_number: null,
    container_type: "40HC",
    simple_product_name: ["Product A", "Product B"],
    providers: ["Provider A", "Provider B"],
    importers: ["Importer A", "Importer B"],
    conditions: ["Condition A", "Condition B"],
    direction: "Import",
    store_name: "Main Store",
    store: new ObjectId(),
    provider: [new ObjectId(), new ObjectId()],
    delivery_channel: new ObjectId(),
    agent: "Agent Company",
    added_products_list: [],
    place_of_dispatch: "Shanghai",
    delivery_method: "Море",
    line: "Main Line",
    ready_date: null,
    load_date: null,
    etd: null,
    eta: null,
    eta_update: false,
    release: null,
    bl_smgs_cmr: false,
    td: false,
    date_do: null,
    date_do_update: false,
    port: "Vladivostok",
    is_ds: false,
    fraht_account: "FR001",
    is_docs: [],
    declaration_number: [],
    declaration_issue_date: null,
    declaration_issue_date_update: false,
    declaration_status: [],
    availability_of_ob: null,
    answer_of_ob: null,
    expeditor: "Main Expeditor",
    destination_station: "Moscow",
    km_to_dist: { km_to_dist: "0", dist_was_updated: false },
    train_depart_date: null,
    train_depart_date_update: false,
    train_arrive_date: null,
    train_arrive_date_update: false,
    pickup: "Local",
    store_arrive_date: null,
    store_arrive_date_update: false,
    stock_place: new ObjectId(),
    stock_place_name: "Main Warehouse",
    fraht: "Standard",
    bid: 0,
    note: "",
    creator: new ObjectId(),
    updator: new ObjectId(),
    hidden: false,
    latest_comment: "",
    latest_comment_id: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Generate 18 items with variations
  return Array.from({ length: 18 }, (_, index) => {
    const containerNum = `CONT${String(index + 1).padStart(3, '0')}`;
    const item: Item = { ...baseItem, _id: new ObjectId(), container_number: containerNum };
    
    // Customize based on index ranges similar to original data
    if (index < 2) { // Total in transit
      item.delivery_method = "Море";
      item.km_to_dist = { km_to_dist: String((index + 1) * 100), dist_was_updated: true };
    } else if (index < 4) { // Ready for pickup in Moscow
      item.delivery_method = "Поезд";
      item.declaration_issue_date = today;
      item.declaration_issue_date_update = true;
      item.date_do_update = true;
      item.km_to_dist = { km_to_dist: "0", dist_was_updated: true };
    } else if (index < 6) { // In transit by rail in RF
      item.delivery_method = "Поезд";
      item.train_depart_date_update = true;
      item.km_to_dist = { km_to_dist: String((index + 1) * 100), dist_was_updated: true };
    } else if (index < 8) { // In port or arriving to port
      item.delivery_method = "Море";
      item.etd = new Date();
    } else if (index < 10) { // In transit by sea route
      item.delivery_method = "Море";
    } else if (index < 12) { // In transit by direct rail
      item.delivery_method = "Поезд";
      item.train_depart_date_update = true;
      item.km_to_dist = { km_to_dist: String((index + 4) * 100), dist_was_updated: true };
    } else if (index < 14) { // In transit by direct auto
      item.delivery_method = "Авто";
    } else if (index < 16) { // Has customs declaration, waiting for submission
      item.delivery_method = "Море";
      item.date_do_update = true;
    } else { // Customs declaration issued today
      item.delivery_method = "Море";
      item.declaration_issue_date = today;
      item.declaration_issue_date_update = true;
      item.date_do_update = true;
    }

    return item;
  });
};

export const populateTestData = async () => {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection(followingCollectionName);

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data');

    // Insert test data
    const testData = generateTestData();
    const result = await collection.insertMany(testData);
    console.log(`Inserted ${result.insertedCount} test records`);

    // Log some stats
    const stats = {
      totalDocuments: await collection.countDocuments(),
      byDeliveryMethod: {
        sea: await collection.countDocuments({ delivery_method: "Море" }),
        rail: await collection.countDocuments({ delivery_method: "Поезд" }),
        auto: await collection.countDocuments({ delivery_method: "Авто" })
      }
    };
    
    console.log('Database stats:', stats);
  } catch (error) {
    console.error('Error populating test data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
};

// Run the population script if this file is executed directly
if (require.main === module) {
  populateTestData()
    .then(() => console.log('Test data population completed'))
    .catch(console.error);
} 