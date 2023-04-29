const sqlite3 = require('sqlite3').verbose();
const db_funcs = require("./db");


// const TABLE_STRUCT = {
//   "users" : "users(user_id) VALUES(?)",
//   "criterion_1" : "criterion_1(user_id, grade_1, grade_2) VALUES(?)",
//   "criterion_2" : "criterion_1(user_id, grade_1, grade_2) VALUES(?, ?)",
//   "criterion_3" : "criterion_1(user_id, grade_1, grade_2, grade_3, grade_4) VALUES(?, ?, ?, ?)",
//   "criterion_4" : "criterion_1(user_id, grade_1, grade_2) VALUES(?, ?)",
//   "criterion_5" : "criterion_1(user_id, grade_1, grade_2, grade_3, grade_4, grade_5) VALUES(?, ?, ?, ?, ?)",
// };

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
  return db;
}

module.exports.set_grade = async function (db, user_id, criterion, grade_num, grade) {
  const data = [grade, user_id];
  const sql = `UPDATE criterion_${criterion}
              SET grade_${grade_num} = ?
              WHERE user_id = ?`;
  db.run(sql, data, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
}

module.exports.get_rating = async function (db) {
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
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}
