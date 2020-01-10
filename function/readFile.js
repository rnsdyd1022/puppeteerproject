const xlsx = require("xlsx");

const readFile = (file) => {
    const wb = xlsx.readFile(file);
    const ws = wb.Sheets[wb.SheetNames[0]];

    var list = xlsx.utils.sheet_to_json(ws);  
    console.log(list);  
    return list;
}
module.exports = readFile;
