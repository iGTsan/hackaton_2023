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

module.exports.ID_grade_parse = async function(filename) {
  let workbook
  try {
    workbook = await XLSX.readFile(filename);
  } catch (err) {
    return console.log(err.message);
  }
  return new Promise(function(resolve, reject) {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let id_col = 'A';
    let grade_col = 'B'
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

module.exports.ID_grade_grade_grade_parse = async function(filename) {
  let workbook
  try {
    workbook = await XLSX.readFile(filename);
  } catch (err) {
    return console.log(err.message);
  }
  return new Promise(function(resolve, reject) {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let id_col = 'A';
    let grade1_col = 'B'
    let grade2_col = 'C'
    let grade3_col = 'D'
    let row_numb = 2;
    let res = []
    while (`${id_col}${row_numb}` in worksheet) {
      const id = worksheet[`${id_col}${row_numb}`].v;
      let grade1 = worksheet[`${grade1_col}${row_numb}`].w;
      grade1 = +grade1.match(/^[0-9]+/)[0];
      let grade2 = worksheet[`${grade2_col}${row_numb}`].w;
      grade2 = +grade2.match(/^[0-9]+/)[0];
      let grade3 = worksheet[`${grade3_col}${row_numb}`].w;
      grade3 = +grade3.match(/^[0-9]+/)[0];
      res.push([id, grade1, grade2, grade3]);
      row_numb++;
    }
    resolve(res);
  });
}

module.exports.ID_name_grade_parse = async function(filename) {
  let workbook
  try {
    workbook = await XLSX.readFile(filename);
  } catch (err) {
    return console.log(err.message);
  }
  return new Promise(function(resolve, reject) {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let id_col = 'A';
    let name_col = 'B';
    let grade_col = 'C'
    let row_numb = 2;
    let res = []
    while (`${id_col}${row_numb}` in worksheet) {
      const id = worksheet[`${id_col}${row_numb}`].v;
      const name = worksheet[`${name_col}${row_numb}`].w;
      let grade = worksheet[`${grade_col}${row_numb}`].w;
      grade = +grade.match(/^[0-9]+/)[0];
      res.push([id, name, grade]);
      row_numb++;
    }
    resolve(res);
  });
}
