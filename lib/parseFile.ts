import Papa from "papaparse";
import * as XLSX from "xlsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseUploadedFile(fileName: string, fileBuffer: Buffer): any[] {
  const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

  if (isExcel) {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(sheet);
  } else {
    // CSV maan lo
    const text = fileBuffer.toString("utf-8");
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    return parsed.data;
  }
}