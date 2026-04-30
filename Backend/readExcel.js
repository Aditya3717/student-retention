import xlsx from 'xlsx';
import path from 'path';

const workbook = xlsx.readFile(path.resolve('../2027_Btech_cse_sem2_updated.xlsx'));
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('Columns:', Object.keys(data[0]));
console.log('First Row:', data[0]);
