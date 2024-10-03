import KmToDistService from '../km-to-dist.service';

describe('KmToDistService', () => {
  let service = new KmToDistService();

  beforeEach(() => {
    service = new KmToDistService();
  });

  describe('addDayToDate', () => {
    it('should correctly add days to a given date', () => {
      const result = (service as any).addDayToDate(new Date('2023-01-01'), 5);

      expect(result).toEqual(new Date('2023-01-06'));
    });

    it('should handle adding zero days correctly', () => {
      const result = (service as any).addDayToDate(new Date('2023-01-01'), 0);

      expect(result).toEqual(new Date('2023-01-01'));
    });

    it('should correctly add a negative number of days', () => {
      const result = (service as any).addDayToDate(new Date('2023-01-10'), -5);

      expect(result).toEqual(new Date('2023-01-05'));
    });
  });
});
