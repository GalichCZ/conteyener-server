import { TimeStampsType } from './TimeStamps.type';

export interface DeclarationStatusType extends TimeStampsType {
  id: string;
  status: string;
  message: string;
  date: Date;
  declaration_number_id: string;
}
