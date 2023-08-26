const XLSX = require("xlsx");


module.exports.parse_for_grades = async function(filename) {
  let workbook
  try {
    workbook = await XLSX.readFile(filename);
  } catch (err) {
    return console.log(err.message);
  }
  return new Promise(function(resolve, reject) {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let id_col = 'A';
    let grade_col = 'E'
    let row_numb = 2;
    let res = []
    while (`${id_col}${row_numb}` in worksheet) {
      const id = worksheet[`${id_col}${row_numb}`].v;
      let grade = worksheet[`${grade_col}${row_numb}`].w;
      grade = +grade.match(/^[0-9]+/)[0];
      res.push([id, grade]);
      row_numb++;
    }
    resolve(res);
  });
}

module.exports.parse_for_users = async function(filename) {
  let workbook
  try {
    workbook = await XLSX.readFile(filename);
  } catch (err) {
    return console.log(err.message);
  }
  return new Promise(function(resolve, reject) {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let id_col = 'A';
    let code_col = 'B'
    let div_col = 'C'
    let row_numb = 2;
    let res = []
    while (`${id_col}${row_numb}` in worksheet) {
      const id = worksheet[`${id_col}${row_numb}`].v;
      const code = worksheet[`${code_col}${row_numb}`].w;
      const div = worksheet[`${div_col}${row_numb}`].v;
      res.push([id, code, div]);
      row_numb++;
    }
    resolve(res);
  });

}
