import elasticClient from '../../../provider/elastic/elastic';
import { FOLLOWING_INDEX } from '../../../provider/elastic/indicies';

export const onDelete = async (following_id: string) => {
  await elasticClient.delete({
    index: FOLLOWING_INDEX,
    id: following_id,
  });
};
