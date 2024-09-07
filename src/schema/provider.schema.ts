import { z } from 'zod';

export const ProviderSchema = z.object({
  name: z
    .union([
      z.string().trim().min(1, 'Поставщик не может быть пустым'),
      z.null(),
    ])
    .refine((val) => val !== null, {
      message: 'Поставщик не может быть null',
    }),
});
