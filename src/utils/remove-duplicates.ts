/*
 * Remove duplicates from an array
 */
export const removeDuplicates = (array: any) => {
  const isDate = array.find((ar: any) => ar instanceof Date);

  if (isDate) {
    const noNullDates = array.filter((date: any) => date !== null);
    return Array.from(
      new Set(noNullDates.map((date: Date) => date.toISOString()))
    );
  }

  return array.filter(
    (value: any, index: number, self: any) =>
      self.indexOf(value) === index && value !== null
  );
};
