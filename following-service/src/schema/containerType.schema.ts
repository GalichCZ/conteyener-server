import { z } from 'zod';

export const ContainerTypeSchema = z.object({
  type_name: z
    .union([z.string().trim().min(1, 'Имя не может быть пустым'), z.null()])
    .refine((val) => val !== null, {
      message: 'Имя не может быть null',
    }),
});
