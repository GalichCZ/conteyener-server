import { TimeStampsType } from './TimeStamps.type';

export interface FollowingType extends TimeStampsType {
  id: string;
  request_date: Date;
  inside_number: string[] | null;
  proform_number: string[] | null;
  container_number: string | null;
  importers: string[];
  conditions: string[];
  direction: string;
  agent: string;
  place_of_dispatch: string;
  line: string | null;
  ready_date: Date | null;
  load_date: Date | null;
  release: Date | null;
  bl_smgs_cmr: boolean;
  td: boolean;
  port: string | null;
  availability_of_ob: Date | null;
  answer_of_ob: Date | null;
  expeditor: string | null;
  destination_station: string | null;
  pickup: string | null;
  fraht: string | null;
  hidden: boolean;
}
