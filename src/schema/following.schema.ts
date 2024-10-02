import { z } from 'zod';

export const FollowingSchema = z.object({
  request_date: z
    .union([
      z
        .string({ required_error: 'Дата запроса не может быть пустой' })
        .datetime(),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Дата запроса не может быть null',
    }),

  delivery_method: z
    .union([z.string().uuid('Метод доставки не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Метод доставки не может быть null',
    }),

  providers: z
    .union([
      z
        .string()
        .uuid('Поставщик не может быть пустым')
        .array()
        .min(1, 'Поставщик не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Поставщик не может быть null',
    }),

  importers: z
    .union([
      z.string().array().min(1, 'Импортеры не могут быть пустыми'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Импортеры не могут быть null',
    }),

  conditions: z
    .union([
      z.string().array().min(1, 'Условия не могут быть пустыми'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Условия не могут быть null',
    }),

  store: z
    .union([z.string().uuid('Склад не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Склад не может быть null',
    }),

  direction: z
    .union([
      z.string().trim().min(1, 'Направление не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Направление не может быть null',
    }),

  agent: z
    .union([z.string().trim().min(1, 'Агент не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Агент не может быть null',
    }),

  order_numbers: z
    .union([
      z.string().array().min(1, 'Номер заказа не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Номер заказа не может быть null',
    }),

  place_of_dispatch: z
    .union([
      z.string().trim().min(1, 'Место отправки не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Место отправки не может быть null',
    }),

  container_type: z
    .union([z.string().uuid('Тип контейнера не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Тип контейнера не может быть null',
    }),
});
