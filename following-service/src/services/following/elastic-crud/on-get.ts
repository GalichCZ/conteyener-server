import elasticClient from '../../../provider/elastic/elastic';
import { FOLLOWING_INDEX } from '../../../provider/elastic/indicies';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Filter } from '../../../types/where-conditions';

export const onGet = async (
  search: string,
  filters: Filter[]
): Promise<string[]> => {
  try {
    const filterClauses = [];

    for (const filter of filters) {
      if (!filter.is_elastic) continue;
      filterClauses.push({
        match_phrase: {
          [filter.key]: filter.value,
        },
      });
    }

    const followings = await elasticClient.search({
      index: FOLLOWING_INDEX,
      body: {
        query: {
          bool: {
            should: [
              ...filterClauses,
              {
                multi_match: {
                  query: search,
                  type: 'best_fields',
                  fields: [
                    'inside_number',
                    'proform_number',
                    'container_number',
                    'importers',
                    'conditions',
                    'direction',
                    'agent',
                    'place_of_dispatch',
                    'line',
                    'port',
                    'expeditor',
                    'destination_station',
                    'pickup',
                    'fraht_account',
                    'store',
                    'stock_place',
                    'container_type',
                    'delivery_method',
                    'declaration_number',
                    'km_to_dist',
                    'simple_product_name',
                    'order_number',
                    'providers',
                  ],
                },
              },
            ],
          },
        },
      },
    });

    return followings.hits.hits.map(
      (f: SearchHit<{ id: string }>) => f._source.id
    );
  } catch (error) {
    throw error;
  }
};
