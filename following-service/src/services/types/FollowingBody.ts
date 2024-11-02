export type OrderNumber = { number: string; id: string };
export type DeclarationNumber = { number: string; id: string | null };
export type ProductBody = { name: string; id: string | null };
interface FollowingBody {
  request_date: Date;
  delivery_method: string;
  inside_number: string[] | null;
  proform_number: string[] | null;
  order_numbers: OrderNumber[] | null;
  container_number: string | null;
  products: ProductBody[] | null;
  providers: string[];
  importers: string[];
  conditions: string[];
  direction: string;
  store: string;
  delivery_channel: string;
  agent: string;
  container_type: string;
  place_of_dispatch: string;
  line: string | null;
  ready_date: Date | null;
  load_date: Date | null;
  release: Date | null;
  bl_smgs_cmr: boolean;
  td: boolean;
  port: string | null;
  is_ds: boolean;
  fraht: string | null;
  declaration_number: DeclarationNumber[];
  availability_of_ob: Date | null;
  answer_of_ob: Date | null;
  expeditor: string | null;
  destination_station: string | null;
  stock_place: string;
  pickup: string | null;
}

export type IFollowingUpdate = Partial<FollowingBody>;

export type IFollowingCreate = Pick<
  FollowingBody,
  | 'request_date'
  | 'delivery_method'
  | 'importers'
  | 'conditions'
  | 'agent'
  | 'direction'
  | 'store'
  | 'container_type'
  | 'place_of_dispatch'
  | 'providers'
> & {
  order_numbers: string[];
};
