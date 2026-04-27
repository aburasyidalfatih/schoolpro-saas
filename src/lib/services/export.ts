import ExcelJS from "exceljs"

interface ExportColumn {
  header: string
  key: string
  width?: number
}

export async function exportToExcel(
  data: Record<string, any>[],
  columns: ExportColumn[],
  sheetName: string = "Data"
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "SaasMasterPro"
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet(sheetName)

  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
  }))

  // Style header
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE8EAF6" },
  }

  // Add data
  data.forEach((row) => {
    worksheet.addRow(row)
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
