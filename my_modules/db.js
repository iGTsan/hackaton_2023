const sqlite3 = require('sqlite3').verbose();
const db_funcs = require("./db");
const fs = require("fs");

const TABLE_STRUCT = {
  "users" : "users(user_id) VALUES(?)",
  "criterion_1" : "criterion_1(user_id) VALUES(?)",
  "criterion_2" : "criterion_2(user_id) VALUES(?)",
  "criterion_3" : "criterion_3(user_id) VALUES(?)",
  "criterion_4" : "criterion_4(user_id) VALUES(?)",
  "criterion_5" : "criterion_5(user_id) VALUES(?)",
};

module.exports.insert = async function (db, tablename, values) {
  if (!tablename in TABLE_STRUCT) {
    return console.log("No such table");
  }
  const querry = `INSERT INTO ${TABLE_STRUCT[tablename]}`;
  db.run(querry, values, function(err) {
    if (err) {
      return console.log("Error", err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}

module.exports.add_user = async function (db, user_id) {
  db_funcs.insert(db, "users", user_id);
  const CRITERION_NUM = 5;
  for (let i = 1; i <= CRITERION_NUM; i++) {
    db_funcs.insert(db, `criterion_${i}`, user_id);
  }
}


module.exports.open = async function (filename) {
  let db = new sqlite3.Database(`./db/${filename}`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });
  console.log("DB returned");
   return db;
}

module.exports.add_grade = async function (db, user_id, criterion, grade_num, grade) {
  const data = [grade, user_id];
  const sql = `UPDATE criterion_${criterion}
              SET grade_${grade_num} = grade_${grade_num} + ?
              WHERE user_id = ?`;
  db.run(sql, data, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
}

module.exports.get_rating = async function (db) {
  // let ress = [];
  const sql = `SELECT users.user_id as ID,
                (criterion_1.grade_1 + criterion_1.grade_2) as GRADE_1,
                (criterion_2.grade_1 + criterion_2.grade_2) as GRADE_2,
                (criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4) as GRADE_3,
                (criterion_4.grade_1 + criterion_4.grade_2) as GRADE_4,
                (criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5) as GRADE_5,
                (criterion_1.grade_1 + criterion_1.grade_2 +
                criterion_2.grade_1 + criterion_2.grade_2 +
                criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4 +
                criterion_4.grade_1 + criterion_4.grade_2 +
                criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5) as TOTAL_GRADE
                FROM users
                INNER JOIN criterion_1
                ON users.user_id = criterion_1.user_id
                INNER JOIN criterion_2
                ON users.user_id = criterion_2.user_id
                INNER JOIN criterion_3
                ON users.user_id = criterion_3.user_id
                INNER JOIN criterion_4
                ON users.user_id = criterion_4.user_id
                INNER JOIN criterion_5
                ON users.user_id = criterion_5.user_id
                ORDER BY (criterion_1.grade_1 + criterion_1.grade_2 +
                criterion_2.grade_1 + criterion_2.grade_2 +
                criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4 +
                criterion_4.grade_1 + criterion_4.grade_2 +
                criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5)`;
  console.log(db);
  let res = [];
  let db_promise = db.each(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    // rows.forEach((row) => {
    //   // console.log(row);
    //   ress.push(row);
    // });
    // console.log(ress);
    // console.log(rows);
    res.push(rows);
    console.log("Row", rows);
  });
  console.log("DB promise", db_promise);

    return res;

}

async function rating_generation(rating) {
  let res = await fs.promises.readFile("pages/table_all_cropped.html");
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
}

module.exports.gen_rating = async function (db) {
  const sql = `SELECT users.user_id as ID,
                (criterion_1.grade_1 + criterion_1.grade_2) as GRADE_1,
                (criterion_2.grade_1 + criterion_2.grade_2) as GRADE_2,
                (criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4) as GRADE_3,
                (criterion_4.grade_1 + criterion_4.grade_2) as GRADE_4,
                (criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5) as GRADE_5,
                (criterion_1.grade_1 + criterion_1.grade_2 +
                criterion_2.grade_1 + criterion_2.grade_2 +
                criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4 +
                criterion_4.grade_1 + criterion_4.grade_2 +
                criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5) as TOTAL_GRADE
                FROM users
                INNER JOIN criterion_1
                ON users.user_id = criterion_1.user_id
                INNER JOIN criterion_2
                ON users.user_id = criterion_2.user_id
                INNER JOIN criterion_3
                ON users.user_id = criterion_3.user_id
                INNER JOIN criterion_4
                ON users.user_id = criterion_4.user_id
                INNER JOIN criterion_5
                ON users.user_id = criterion_5.user_id
                ORDER BY (criterion_1.grade_1 + criterion_1.grade_2 +
                criterion_2.grade_1 + criterion_2.grade_2 +
                criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4 +
                criterion_4.grade_1 + criterion_4.grade_2 +
                criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5) DESC`;
  console.log(db);
  let res = [];
  let db_promise = db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rating_generation(rows);
  });
  console.log("DB promise", db_promise);

    return res;

}
