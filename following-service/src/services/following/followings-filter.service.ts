import FollowingService from './following.service';
import {
  WhereConditions,
  WhereConditionsScopes,
} from '../../types/where-conditions';

class FollowingsFilterService extends FollowingService {
  constructor() {
    super();
  }

  /*
   * filter all possible poles through the elastic search
   * if there is a pole that is not in elastic index => add filter to sql query
   * all elastic search results will be paginated
   * if with extra pole there is no any results => get second page of elastic
   * repeat it till the end of pages
   * max page size returning to the client is 50
   * while mapping results from elastic with extra pole case =>
   *  add results to answer array until it's 50
   */

  //TODO: make body type
  async filterFollowings(filtersBody: any) {
    const transaction = await this._followingRepository.startTransaction();
    try {
      const { filters, search } = filtersBody;

      const foreignValues: WhereConditions[] = [];

      const test: WhereConditionsScopes = {};

      if (filters) {
        filters.forEach(
          ({
            scope,
            is_foreign,
            column,
            value,
          }: {
            scope: string;
            column: string;
            is_foreign: boolean;
            value: any;
          }) => {
            if (scope && column && value) {
              if (is_foreign) {
                foreignValues.push({ [column]: value });
                return;
              }
              if (!test[scope]) {
                test[scope] = [];
                test[scope].push({ [column]: value });
              }
              test[scope].push({ [column]: value });
            }
          }
        );
      }

      const followings = await this._followingRepository.filterAndSearch(
        test,
        foreignValues,
        search,
        filtersBody
      );
      await transaction.commit();
      return followings;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default FollowingsFilterService;
