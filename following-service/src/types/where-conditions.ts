export type WhereConditions = Record<string, string | number | boolean | Date>;

export type WhereConditionsScopes = { [key: string]: WhereConditions[] };

type Filter = {
  scope: string;
  is_foreign: boolean;
  column: string;
  value: any;
  is_array?: boolean;
  belongs_to?: string;
};

export type FilterBody = {
  filters: Filter[];
  search: string;
};
