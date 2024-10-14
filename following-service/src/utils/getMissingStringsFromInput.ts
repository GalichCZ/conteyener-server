/*returns array of missing strings in input*/
export const getMissingStringsFromInput = (
  input_strings: string[],
  strings_to_compare: string[]
): string[] => {
  const normalizedInput = input_strings.map((order) =>
    order.trim().toLowerCase()
  );
  return strings_to_compare.filter(
    (order) => !normalizedInput.includes(order.trim().toLowerCase())
  );
};
