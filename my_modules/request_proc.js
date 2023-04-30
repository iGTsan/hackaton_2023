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

function admin_update_grades(params) {
  try {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      // console.log(params);
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

function hr_update_grades(params) {
  try {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      let add_promise = db_funcs.add_grade(db,
         params["user_id"], 4, params["listGroupTask"], params["grade"]);
      add_promise.then( () => {
        // db_funcs.get_rating(db);
      })
      db.close();
    })
  } catch (err) {
    console.log(err.message);
  }
  return null;
}

function hr_file_upload(params) {
  console.log(params);
  if (params["file_add_hr"]) {
    try {
      console.log();
      let db_promise = db_funcs.open("database.db");
      db_promise.then((db) => {
        let add_promise = db_funcs.add_grade(db,
           params["user_id"], 3, params["listGroupTask"], GRADE_FOR_HR_UPLOAD_3RD_CRIT);
        add_promise.then( () => {
          // db_funcs.get_rating(db);
        })
      })
    } catch (err) {
      console.log(err.message);
    }
  }
  return null;
}

function user_file_upload(params) {
  if (params["file_add1"] && params["file_add2"]) {
    try {
      let db_promise = db_funcs.open("database.db");
      db_promise.then((db) => {
        let add_promise = db_funcs.add_grade(db,
           params["user_id"], 5, 1, GRADE_FOR_USER_UPLOAD_5TH_CRIT);
        add_promise.then( () => {
          // db_funcs.get_rating(db);
        })
      })
    } catch (err) {
      console.log(err.message);
    }
  }
  return null;
}

function check(db, params) {
  return new Promise(function(resolve, reject) {
    const id = params["user_id"];
    const code = params["code"];
    const sql = `SELECT *
                FROM registered_users
                WHERE user_id = ${id} AND code = '${code}'`;
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
  });
}

async function generate_bad_login() {
  console.log("Bad login");
  text = await fs.promises.readFile("./pages/profile_error.html");
  return text;
}

async function generate_good_login(params) {
  console.log("Good login");
  text = await fs.promises.readFile("./pages/profile_user_cropped.html");
  return new Promise(function(resolve, reject) {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      let rating_promise = db_funcs.gen_user_rating(db, params["user_id"])
      rating_promise.then((rating) => {
        rating = rating[0];
        console.log(rating);
        for (let i = 1; i <= 16; i++) {
          text += `
          <td>${rating[`d${i}`]}</td>`;
        }
        text += `
         </tr>
        </tbody>
       </table>
     </div>
      <p class="hidden" id="user_id">${params["user_id"]}</p>
      <script src="scripts/user_id.js"></script>`
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

const FORMS_ROUTE = {
  // '1' : proc_id,
  '2' : hr_update_grades,
  '3' : admin_update_grades,
  '4' : hr_file_upload,
  '5' : user_file_upload,
  '6' : update_rating,
  'login' : user_login
}

module.exports.proc_params = async function(params) {
  form_id = 'form_id';
  if (params[form_id] in FORMS_ROUTE)
    return FORMS_ROUTE[params[form_id]](params);
  return null;
}
