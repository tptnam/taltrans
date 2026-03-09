import { z } from 'zod'

export const CreateTranslationSchema = z.object({
  zh: z.string().min(1),
  en: z.string().min(1)
})

export const UpdateTranslationSchema = z.object({
  zh: z.string().min(1).optional(),
  en: z.string().min(1).optional()
})

export type CreateTranslationRequest = z.infer<typeof CreateTranslationSchema>
export type UpdateTranslationRequest = z.infer<typeof UpdateTranslationSchema>
