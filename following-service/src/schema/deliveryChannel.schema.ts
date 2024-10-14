import { z } from 'zod';

export const DeliveryChannelSchema = z.object({
  name: z
    .union([
      z.string().trim().min(1, 'Название канала не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Название канала не может быть null',
    }),
  eta: z.number().min(0, 'Дни ETA не может быть меньше 0'),
  date_do: z.number().min(0, 'Дни Даты ДО не может быть меньше 0'),
  declaration_issue_date: z
    .number()
    .min(0, 'Дни Даты выпуска декларации не может быть меньше 0'),
  train_depart_date: z
    .number()
    .min(0, 'Дни Даты отправки поезда не может быть меньше 0'),
  train_arrive_date: z
    .number()
    .min(0, 'Дни Даты прибытия поезда не может быть меньше 0'),
  store_arrive_date: z
    .number()
    .min(0, 'Дни Даты прибытия склада не может быть меньше 0'),
});
