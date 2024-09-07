import { TimeStampsType } from './TimeStamps.type';

export interface IsDocsType extends TimeStampsType {
  id: string;
  pi: boolean;
  ci: boolean;
  pl: boolean;
  ss_ds: boolean;
  contract_agrees: boolean;
  cost_agrees: boolean;
  instructions: boolean;
  ed: boolean;
  co: boolean;
  bill: boolean;
  ready_to_process: boolean;
  link_to_docs: string | null;
  order_id: string;
}
