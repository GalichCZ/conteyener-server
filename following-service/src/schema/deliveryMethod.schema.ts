import { z } from 'zod';

export const DeliveryMethodSchema = z.object({
  method: z
    .union([
      z.string().trim().min(1, 'Метод доставки не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Метод доставки не может быть null',
    }),

  description: z
    .union([
      z.string().trim().min(1, 'Описание не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Описание не может быть null',
    }),
});
