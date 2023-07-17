const db_funcs = require("./db");
const fs = require("fs");

const GRADE_FOR_USER_UPLOAD_5TH_CRIT = 5;
const GRADE_FOR_HR_UPLOAD_3RD_CRIT = 5;

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
      console.log("UPDATE GRADES", params);
      let add_promise = db_funcs.add_grade(db,
         params["user_id"], params["crit"], params["podcrit"], params["grade"]);
      add_promise.then( () => {
        // db_funcs.get_rating(db);
      })
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
  params["grade"] = GRADE_FOR_HR_UPLOAD_3RD_CRIT;
  return update_grades(params);
}

function user_file_upload(params) {
  params["crit"] = 5;
  params["podcrit"] = 1;
  params["grade"] = GRADE_FOR_USER_UPLOAD_5TH_CRIT;
  return update_grades(params);
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
  'crit_5' : user_file_upload
}

module.exports.proc_params = async function(params) {
  form_id = 'form_id';
  if (params[form_id] in FORMS_ROUTE)
    return FORMS_ROUTE[params[form_id]](params);
  return null;
}
