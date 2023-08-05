const db_funcs = require("./db");
const fs = require("fs");

const GRADES = {
  1 : 5,
  2 : 5,
  3 : 5,
  4 : 5,
  5 : 5
}

module.exports.parse_params = async function(url) {
  const paramsRegExp = /[^?]+$/;
  const params_raw = url.match(paramsRegExp);
  if (params_raw) {
    const params_list = params_raw[0].split('&');
    params = {};
    params_list.forEach((item, i) => {
      const item_splitted = item.split('=');
      params[item_splitted[0]] = item_splitted[1];
    });
    return params;
  }
}

function update_grades(params) {
  try {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      db_funcs.add_grade(db,
         params["user_id"], params["crit"], params["podcrit"], params["grade"]);
    })
  } catch (err) {
    console.log(err.message);
  }
  return null;
}

function set_grades(params) {
  try {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      db_funcs.set_grade(db,
         params["user_id"], params["crit"], params["podcrit"], params["grade"]);
    })
  } catch (err) {
    console.log(err.message);
  }
  return null;
}

function admin_update_grades(params) {
  return update_grades(params);
}

function hr_update_grades(params) {
  params["crit"] = 4;
  params["podcrit"] = params["listGroupTask"];
  return update_grades(params);
}

function hr_file_upload(params) {
  params["crit"] = 3;
  params["podcrit"] = params["listGroupTask"];
  params["grade"] = GRADES[params["crit"]];
  return update_grades(params);
}

function user_file_upload(params) {
  params["crit"] = 5;
  params["podcrit"] = 1;
  params["grade"] = GRADES[params["crit"]];
  return update_grades(params);
}

function update_tests(params) {
  params["crit"] = 4;
  params["podcrit"] = 1;
  params["grade"] = (GRADES[4] * params["grade"]) / 100;
  return set_grades(params);
}

function check(db, params) {
  return new Promise(function(resolve, reject) {
    const id = params["user_id"];
    const code = params["code"];
    const sql = `SELECT *
                FROM registered_users
                WHERE user_id = ${id} AND code = '${code}'`;
    try {
      db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        if (rows.length) {
          resolve(1);
        } else {
          reject(0);
        }
      });
    } catch {
      reject(0);
    }
  });
}

async function generate_bad_login() {
  console.log("Bad login");
  // text = await fs.promises.readFile("./pages/profile_error.html");
  text = "No such user";
  return text;
}

async function generate_good_login(params) {
  console.log("Good login");
  text = "";
  return new Promise(function(resolve, reject) {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      let rating_promise = db_funcs.gen_user_rating(db, params["user_id"])
      rating_promise.then((rating) => {
        rating = rating[0];
        console.log(rating);
        for (let i = 1; i <= 16; i++) {
          text += `${rating[`d${i}`]} `;
        }
        text += `\n${params["user_id"]} ${params["code"]}`;
        resolve(text);
      })
    })
  });
}

function user_login(params) {
  return new Promise(function(resolve, reject) {
    try {
      let db_promise = db_funcs.open("users.db");
      db_promise.then((db) => {
        let check_promise = check(db, params)
        console.log("Start checking");
        check_promise.then( (val) => {
          console.log("Checked");
          generate_good_login_promise = generate_good_login(params);
          generate_good_login_promise.then((text) => {
            resolve(text);
            db.close();
          })
          // db_funcs.get_rating(db);
        }, (err) => {
          resolve(generate_bad_login());
          db.close();
        })
      })
    } catch (err) {
      console.log(err.message);
    }
  });
}

async function update_rating(params) {
  try {
    let db_promise = db_funcs.open("database.db");
    let res = await fs.promises.readFile("pages/table_all_cropped.html");
    db_promise.then((db) => {
      let rating_promise = db_funcs.gen_rating(db);
      rating_promise.then((rating) => {
        rating.forEach((item, i) => {
          const row = `<tr>
                  <td>${item["ID"]}</td>
                  <td>${item["GRADE_1"]}</td>
                  <td>${item["GRADE_2"]}</td>
                  <td>${item["GRADE_3"]}</td>
                  <td>${item["GRADE_4"]}</td>
                  <td>${item["GRADE_5"]}</td>
                  <td>${item["TOTAL_GRADE"]}</td>
                  </tr>`
          res += row;
        })
        res += `      </tbody>
                    </table>
                  </div>
                </body>`;
        fs.promises.writeFile("pages/table_all.html", res);
      })
    })
  } catch (err) {
    console.log(err.message);
  }
  return null;
}

function get_table(params) {
  return new Promise(function(resolve, reject) {
    try {
      let db_promise = db_funcs.open("database.db");
      db_promise.then((db) => {
        let rating_promise = db_funcs.gen_rating(db);
        rating_promise.then((rating) => {
          let res = "";
          rating.forEach((item, i) => {
            const row = `${item["ID"]} ${item["GRADE_1"]} ${item["GRADE_2"]} ${item["GRADE_3"]} ${item["GRADE_4"]} ${item["GRADE_5"]} ${item["TOTAL_GRADE"]}\n`
            res += row;
          })
          resolve(res);
        })
      })
    } catch (err) {
      console.log(err.message);
    }
  })
}

function get_user_info(params) {
  return new Promise(function(resolve, reject) {
    try {
      let db_promise = db_funcs.open("users.db");
      db_promise.then((db) => {
        let check_promise = check(db, params)
        console.log("Start checking");
        check_promise.then( (val) => {
          console.log("Checked");
          generate_good_login_promise = generate_good_login(params);
          generate_good_login_promise.then((text) => {
            resolve(text);
            db.close();
          })
          // db_funcs.get_rating(db);
        }, (err) => {
          resolve(generate_bad_login());
          db.close();
        })
      })
    } catch (err) {
      console.log(err.message);
    }
  });
}

function get_files(params) {
  return new Promise(function(resolve, reject) {
    try {
      const directoryPath = './uploads';
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error('Ошибка при чтении директории:', err);
          return;
        }
        let filenames = "\n"
        files.forEach(file => {
          filenames += file + '\n';
        });
        resolve(filenames);
      });
    } catch (err) {
      console.log(err.message);
    }
  });
}

function get_file(params) {
  return new Promise(function(resolve, reject) {
    const filePath = "./uploads/" + params['filename'];
    try {

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve('Файл не найден.');
      }

      // Читаем файл целиком в буфер
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error('Ошибка при чтении файла:', err);
          resolve('Произошла ошибка при скачивании файла.');
        } else {
          resolve(data);
        }
      });
    });
    } catch (err) {
      console.log("GetFile error");
      console.log(err.message);
    }
  });
}

function ParseFilename(filename) {
  const usefull = filename.split(".")[0];
  const params = usefull.split("-");
  let res = new Map();
  res["user_id"] = params[0].split("_")[1];
  res["crit"] = params[1].split("_")[1];
  if (params[2])
    res["podcrit"] = params[2];
  return res;
}

function approve_file(params) {
  params = ParseFilename(params["filename"]);
  params["crit"] = params["crit"];
  params["podcrit"] = params["podcrit"];
  params["grade"] = GRADES[params["crit"]];
  return update_grades(params);
}

function reject_file(params) {
  params = ParseFilename(params["filename"]);
  console.log("File rejected");
  console.log(params);

  return null;
}

const FORMS_ROUTE = {
  // '1' : proc_id,
  '2' : hr_update_grades,
  '3' : admin_update_grades,
  '4' : hr_file_upload,
  '5' : user_file_upload,
  '6' : update_rating,
  'login' : user_login,
  'get_table' : get_table,
  'get_user_info' : get_user_info,
  'crit_5' : user_file_upload,
  'get_files' : get_files,
  'get_file' : get_file,
  'approve_file' : approve_file,
  'reject_file' : reject_file,
  'update_tests' : update_tests,
}

module.exports.proc_params = async function(params) {
  form_id = 'form_id';
  if (params[form_id] in FORMS_ROUTE)
    return FORMS_ROUTE[params[form_id]](params);
  return null;
}
