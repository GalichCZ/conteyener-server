import { getMissingStringsFromInput } from '../getMissingStringsFromInput';

describe('getMissingStringsFromInput', () => {
  it('should return an array of missing strings when some strings are missing', () => {
    const input_strings = ['apple', 'banana', 'cherry'];
    const strings_to_compare = ['banana', 'cherry', 'date', 'elderberry'];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual(['date', 'elderberry']);
  });

  it('should return an empty array when no strings are missing', () => {
    const input_strings = ['apple', 'banana', 'cherry'];
    const strings_to_compare = ['banana', 'apple', 'cherry'];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual([]);
  });

  it('should return all strings when all are missing', () => {
    const input_strings = ['apple', 'banana'];
    const strings_to_compare = ['date', 'elderberry', 'fig'];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual(['date', 'elderberry', 'fig']);
  });

  it('should handle case insensitivity', () => {
    const input_strings = ['Apple', 'Banana', 'Cherry'];
    const strings_to_compare = ['banana', 'cherry', 'Date'];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual(['Date']);
  });

  it('should handle strings with extra spaces', () => {
    const input_strings = [' apple  ', '  banana', 'cherry '];
    const strings_to_compare = ['banana', 'cherry', 'date'];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual(['date']);
  });

  it('should return an empty array when both input arrays are empty', () => {
    const input_strings: string[] = [];
    const strings_to_compare: string[] = [];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual([]);
  });

  it('should return strings_to_compare when input_strings is empty', () => {
    const input_strings: string[] = [];
    const strings_to_compare = ['date', 'elderberry'];
    const result = getMissingStringsFromInput(
      input_strings,
      strings_to_compare
    );

    expect(result).toEqual(['date', 'elderberry']);
  });
});
