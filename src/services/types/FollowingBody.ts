/*
  _id: string
  request_date: string | null
  order_number: { id: string; name: string }[]
  inside_number: string[]
  proform_number: string[]
  container?: Container
  container_number: string | undefined
  container_type: string | undefined
  simple_product_name: string[]
  product: { simple_name: string }[]
  delivery_method: string
  providers: string[]
  provider: Provider[]
  importers: string[]
  conditions: string[]
  store_name: string | undefined
  store: { _id: string; name: string }
  delivery_channel: { _id: string; name: string }
  agent: string | undefined
  place_of_dispatch: string | undefined
  line: string | undefined
  ready_date: string | null
  load_date: string | null
  etd: string
  eta: string
  eta_update: boolean
  release: string | null
  bl_smgs_cmr: boolean
  td: boolean
  date_do: string
  date_do_update: boolean
  port: string | undefined
  is_ds: boolean
  fraht_account: string | undefined
  is_docs: Docs[]
  declaration_number: string[]
  declaration_issue_date: string
  declaration_issue_date_update: boolean
  declaration_status: string
  availability_of_ob: string | null
  answer_of_ob: string | null
  expeditor: string | undefined
  destination_station: string | undefined
  km_to_dist: { km_to_dist: number; dist_was_updated: boolean } | null
  train_depart_date: string
  train_depart_date_update: boolean
  train_arrive_date: string
  train_arrive_date_update: boolean
  pickup: string | undefined
  store_arrive_date: string
  store_arrive_date_update: boolean
  comment: string
  fraht: string | undefined
  bid: number
  note: string
  creator: string
  stock_place_name: string | undefined
  stock_place: { _id: string; name: string }
  hidden: boolean
  direction: string | undefined
  added_products_list: string[]
  product_has_added: ProductExistanceMap
  latest_comment: string
*/
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
  | 'order_numbers'
  | 'providers'
>;
// const {
//   order_number,
//   delivery_method,
//   store: store_id,
//   container_type,
//   request_date,
//   importers,
//   conditions,
//   agent,
//   direction,
//   place_of_dispatch,
//   providers,
// } = followingBody;
