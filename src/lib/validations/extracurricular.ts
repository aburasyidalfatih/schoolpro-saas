import { z } from "zod"

export const extracurricularSchema = z.object({
  name: z.string().min(1, "Nama ekstrakurikuler harus diisi"),
  description: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
})

export type ExtracurricularInput = z.infer<typeof extracurricularSchema>
