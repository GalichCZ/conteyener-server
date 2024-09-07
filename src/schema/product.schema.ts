import { z } from 'zod';

export const ProductSchema = z.object({
  simple_name: z
    .union([z.string().trim().min(1, 'Имя не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Имя не может быть null',
    }),

  hs_code: z
    .union([
      z.string().trim().min(1, 'Код ТнВЭД не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Код ТнВЭД не может быть null',
    }),

  article_ved: z
    .union([
      z.string().trim().min(1, 'Артикул ВЭД не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Артикул ВЭД не может быть null',
    }),

  trade_mark: z
    .union([
      z.string().trim().min(1, 'Торговая марка не может быть пустой'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Торговая марка не может быть null',
    }),

  model: z
    .union([z.string().trim().min(1, 'Модель не может быть пустой'), z.null()])
    .refine((val) => val !== null, {
      message: 'Модель не может быть null',
    }),

  modification: z
    .union([
      z.string().trim().min(1, 'Модификация не может быть пустой'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Модификация не может быть null',
    }),

  product_name: z
    .union([
      z.string().trim().min(1, 'Имя продукта не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Имя продукта не может быть null',
    }),

  manufacturer: z
    .union([
      z.string().trim().min(1, 'Производитель не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Производитель не может быть null',
    }),

  total_price: z
    .union([
      z.number().gte(0, 'Общая стоимость должна быть больше 0'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Общая стоимость не может быть null',
    }),

  weight_gross: z
    .union([z.number().gte(0, 'Грубый вес должнен быть больше 0'), z.null()])
    .refine((val) => val !== null, {
      message: 'Грубый вес не может быть null',
    }),

  weight_net: z
    .union([z.number().gte(0, 'Чистый вес должнен быть больше 0'), z.null()])
    .refine((val) => val !== null, {
      message: 'Чистый вес не может быть null',
    }),

  cbm: z
    .union([z.number().gte(0, 'Объем должнен быть больше 0'), z.null()])
    .refine((val) => val !== null, {
      message: 'Объем не может быть null',
    }),

  piece_price: z
    .union([
      z.number().gte(0, 'Цена за единицу должна быть больше 0'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Цена за единицу не может быть null',
    }),

  quantity_pieces: z
    .union([
      z.number().gte(0, 'Количество единиц должно быть больше 0'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Количество единиц не может быть null',
    }),

  quantity_places: z
    .union([
      z.number().gte(0, 'Количество мест должно быть больше 0'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Количество мест не может быть null',
    }),

  following_id: z
    .union([z.string().uuid('Слежение не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Слежение не может быть null',
    }),
});
