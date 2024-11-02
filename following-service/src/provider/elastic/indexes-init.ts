import elasticClient from './elastic';
import { FOLLOWING_INDEX } from './indicies';

async function createFollowingsIndex() {
  const exists = await elasticClient.indices.exists({ index: FOLLOWING_INDEX });
  if (!exists) {
    await elasticClient.indices.create({
      index: FOLLOWING_INDEX,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            inside_number: { type: 'text' },
            proform_number: { type: 'text' },
            container_number: { type: 'text' },
            importers: { type: 'text' },
            conditions: { type: 'text' },
            direction: { type: 'text' },
            agent: { type: 'text' },
            place_of_dispatch: { type: 'text' },
            line: { type: 'text' },
            port: { type: 'text' },
            expeditor: { type: 'text' },
            destination_station: { type: 'text' },
            pickup: { type: 'text' },
            fraht: { type: 'text' },
            store_name: { type: 'text' },
            stock_place: { type: 'text' },
            container_type: { type: 'text' },
            delivery_method: { type: 'text' },
            declaration_number: { type: 'text' },
            km_to_dist: { type: 'text' },
            order_number: { type: 'text' },
            simple_product: { type: 'text' },
            provider: { type: 'text' },
          },
        },
      },
    });
  }
}

// Call this function to initialize the index
createFollowingsIndex().catch(console.error);
