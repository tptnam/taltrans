import { z } from "zod";

const MappingPairSchema = z.object({
  zh: z.number(),
  en: z.number().optional(),
});

const SheetMappingSchema = z.object({
  sheet: z.string(),
  pairs: z.array(MappingPairSchema),
});

export const TranslateColumnsSchema = z.object({
  fileId: z.string(),
  sheets: z.array(z.string()),
});

export const TranslateProcessSchema = z.object({
  fileId: z.string(),
  mappings: z.array(SheetMappingSchema),
});

export const TranslateAcceptSchema = z.object({
  fileId: z.string(),
  sheets: z.array(
    z.object({
      sheet: z.string(),
      rows: z.array(
        z.object({
          rowIndex: z.number(),
          cells: z.array(
            z.object({
              zh: z.string(),
              en: z.string(),
              status: z.enum(["matched", "ai-suggested", "pending"]),
              columnIndex: z.number(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type TranslateColumnsRequest = z.infer<typeof TranslateColumnsSchema>;
export type TranslateProcessRequest = z.infer<typeof TranslateProcessSchema>;
export type TranslateAcceptRequest = z.infer<typeof TranslateAcceptSchema>;
