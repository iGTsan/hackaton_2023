const XLSX = require("xlsx");


module.exports.parse = async function(filename) {
  let workbook
  try {
    workbook = await XLSX.readFile(filename);
  } catch (err) {
    return console.log(err.message);
  }
  // console.log(workbook.SheetNames);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // console.log(worksheet);
  let id_col = 'A';
  let grade_col = 'E'
  let row_numb = 2;
  // console.log(`${id_col}${row_numb}`);
  let res = []
  while (`${id_col}${row_numb}` in worksheet) {
    // console.log(worksheet[`${id_col}${row_numb}`], worksheet[`${grade_col}${row_numb}`]);
    const id = worksheet[`${id_col}${row_numb}`].v;
    let grade = worksheet[`${grade_col}${row_numb}`].w;
    grade = +grade.match(/^[0-9]+/)[0];
    res.push([id, grade]);
    row_numb++;
  }
  return res;
}
