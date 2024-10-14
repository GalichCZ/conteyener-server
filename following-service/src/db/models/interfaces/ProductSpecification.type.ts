import { TimeStampsType } from './TimeStamps.type';

export interface ProductSpecificationType extends TimeStampsType {
  id: string;
  simple_product_id: string;
  hs_code: string;
  article_ved: string;
  article_erp: string;
  trade_mark: string;
  model: string;
  modification: string;
  product_name: string;
  manufacturer: string;
  quantity_pieces: number;
  quantity_places: number;
  piece_price: number;
  total_price: number;
  weight_net: number;
  weight_gross: number;
  cbm: number;
}
