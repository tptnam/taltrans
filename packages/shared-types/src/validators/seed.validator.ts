import { z } from "zod";

const MappingPairSchema = z.object({
  zh: z.number(),
  en: z.number().optional(),
});

const SheetMappingSchema = z.object({
  sheet: z.string(),
  pairs: z.array(MappingPairSchema),
});

export const SeedColumnsSchema = z.object({
  fileId: z.string(),
  sheets: z.array(z.string()),
});

export const SeedConfirmSchema = z.object({
  fileId: z.string(),
  mappings: z.array(SheetMappingSchema),
});

export type SeedColumnsRequest = z.infer<typeof SeedColumnsSchema>;
export type SeedConfirmRequest = z.infer<typeof SeedConfirmSchema>;
