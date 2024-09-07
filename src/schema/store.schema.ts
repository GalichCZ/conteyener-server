import { z } from 'zod';

export const StoreSchema = z.object({
  name: z
    .union([z.string().trim().min(1, 'Имя не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Имя не может быть null',
    }),

  receiver: z
    .union([
      z.string().trim().min(1, 'Получатель не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Получатель не может быть null',
    }),

  address: z
    .union([z.string().trim().min(1, 'Адрес не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Адрес не может быть null',
    }),

  contact: z
    .union([z.string().trim().min(1, 'Контакт не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Контакт не может быть null',
    }),

  note: z
    .union([
      z.string().trim().min(1, 'Примечание не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Примечание не может быть null',
    }),
});
