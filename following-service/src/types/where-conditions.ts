export type WhereConditions = Record<string, string | number | boolean | Date>;

export type WhereConditionsScopes = { [key: string]: WhereConditions[] };

export type Filter = {
  scope: string;
  is_foreign_key: boolean;
  column: string;
  key: string;
  is_elastic: boolean;
  value: any;
  is_array?: boolean;
  belongs_to?: string;
};

export type FilterBody = {
  filters: Filter[];
  search: string;
};
