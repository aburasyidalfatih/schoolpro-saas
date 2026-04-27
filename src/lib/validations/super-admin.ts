import { z } from "zod"

export const platformSettingSchema = z.object({
  key: z.string().min(1, "Key harus diisi").max(100),
  value: z.string(),
})

export const deleteTenantSchema = z.object({
  id: z.string().min(1, "Tenant ID tidak valid"),
})

export const exportSchema = z.object({
  data: z.array(z.record(z.any())).min(1, "Data tidak boleh kosong"),
  columns: z.array(z.object({
    header: z.string(),
    key: z.string(),
    width: z.number().optional(),
  })).min(1, "Columns tidak boleh kosong"),
  filename: z.string().max(100).optional(),
})

export type PlatformSettingInput = z.infer<typeof platformSettingSchema>
export type ExportInput = z.infer<typeof exportSchema>
