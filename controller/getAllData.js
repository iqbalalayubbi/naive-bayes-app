const XLSX = require("xlsx");
const SHEET_NUMBER = 1;
const LIMIT_ROW = 21;

function getAllData(path = String) {
    const workbook = XLSX.readFile(path, { sheetRows: LIMIT_ROW });
    const sheet_name_list = workbook.SheetNames;
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[SHEET_NUMBER]]);
    return jsonData;
}

module.exports = { getAllData };
