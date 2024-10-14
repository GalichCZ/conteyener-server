// calculateDateService.spec.ts

import CalculateDateService from '../calculate-date.service';
import { DateType } from '../types/calculate-date-body';

describe('CalculateDateService', () => {
  let service: CalculateDateService;

  beforeEach(() => {
    service = new CalculateDateService();
  });

  describe('getDatesToUpdate', () => {
    it('should return dates to update starting from a given date type', () => {
      // Test for different start dates
      const result = (service as any).getDatesToUpdate(DateType.eta);
      expect(result).toEqual([
        DateType.date_do,
        DateType.declaration_issue_date,
        DateType.train_depart_date,
        DateType.train_arrive_date,
        DateType.store_arrive_date,
      ]);

      const result2 = (service as any).getDatesToUpdate(DateType.date_do);
      expect(result2).toEqual([
        DateType.declaration_issue_date,
        DateType.train_depart_date,
        DateType.train_arrive_date,
        DateType.store_arrive_date,
      ]);
    });

    it('should return an empty array if the start date type is the last in the array', () => {
      const result = (service as any).getDatesToUpdate(
        DateType.store_arrive_date
      );
      expect(result).toEqual([]);
    });
  });

  describe('calculateDate', () => {
    it('should calculate the correct date when adding days', () => {
      const date = new Date('2023-01-01');
      const lastNotNullDate = new Date('2023-01-01');
      const daysToAdd = 5;

      const result = (service as any).calculateDate(
        date,
        daysToAdd,
        lastNotNullDate
      );
      expect(result).toEqual(new Date('2023-01-06')); // 2023-01-01 + 5 days
    });

    it('should return null when daysToAdd is 0', () => {
      const date = new Date('2023-01-01');
      const lastNotNullDate = new Date('2023-01-01');
      const daysToAdd = '0';

      const result = (service as any).calculateDate(
        date,
        daysToAdd,
        lastNotNullDate
      );
      expect(result).toBeNull();
    });

    it('should return the last not null date when date is null', () => {
      const date = null;
      const lastNotNullDate = new Date('2023-01-01');
      const daysToAdd = 3;

      const result = (service as any).calculateDate(
        date,
        daysToAdd,
        lastNotNullDate
      );
      expect(result).toEqual(new Date('2023-01-04')); // 2023-01-01 + 3 days
    });
  });
});
