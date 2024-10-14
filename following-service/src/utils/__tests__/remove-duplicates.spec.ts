import { removeDuplicates } from '../remove-duplicates';

describe('removeDuplicates', () => {
  it('should remove duplicate numbers from an array', () => {
    const array = [1, 2, 2, 3, 4, 5, 5];
    const result = removeDuplicates(array);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should remove duplicate strings from an array', () => {
    const array = ['apple', 'banana', 'apple', 'orange'];
    const result = removeDuplicates(array);
    expect(result).toEqual(['apple', 'banana', 'orange']);
  });

  it('should handle an empty array', () => {
    const array: any[] = [];
    const result = removeDuplicates(array);
    expect(result).toEqual([]);
  });

  it('should handle an array with unique elements', () => {
    const array = ['apple', 'banana', 'orange'];
    const result = removeDuplicates(array);
    expect(result).toEqual(['apple', 'banana', 'orange']);
  });

  it('should remove duplicate Date objects based on their ISO string representation', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2024-01-01');
    const array = [date1, date2, date3];
    const result = removeDuplicates(array);
    expect(result).toEqual([date1.toISOString(), date3.toISOString()]);
  });

  it('should remove null values from an array of Date objects', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2024-01-01');
    const array = [date1, null, date2];
    const result = removeDuplicates(array);
    expect(result).toEqual([date1.toISOString(), date2.toISOString()]);
  });
});
