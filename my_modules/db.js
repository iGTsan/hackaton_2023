const sqlite3 = require('sqlite3').verbose();
const xlsx_parse = require("./xlsx_parse");
const fs = require("fs");

const TABLE_STRUCT = {
  "users" : "users(user_id) VALUES(?)",
  "criterion_1" : "criterion_1(user_id) VALUES(?)",
  "criterion_2" : "criterion_2(user_id) VALUES(?)",
  "criterion_3" : "criterion_3(user_id) VALUES(?)",
  "criterion_4" : "criterion_4(user_id) VALUES(?)",
  "criterion_5" : "criterion_5(user_id) VALUES(?)",
  "registered_users" : "registered_users(user_id, code) VALUES(?, ?)"
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

module.exports.add_user = async function (db_grades, db_users, user_id, code) {
  module.exports.insert(db_grades, "users", user_id);
  const CRITERION_NUM = 5;
  for (let i = 1; i <= CRITERION_NUM; i++) {
    module.exports.insert(db_grades, `criterion_${i}`, user_id);
  module.exports.insert(db_users, "registered_users", [user_id, code]);
  }
}

module.exports.add_users = async function (db_grades, db_users, file) {
  return new Promise(function(resolve, reject) {
    let users_promise = xlsx_parse.parse_for_users(file);
    users_promise.then( (users) => {
      users.forEach((item, i) => {
        module.exports.add_user(db_grades, db_users, item[0], item[1]);
      });
      resolve();
    })
  });
}

module.exports.open = async function (filename) {
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database(`./db/${filename}`, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
      resolve(db);
    });
    console.log("DB returned");
  });
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

module.exports.gen_rating = async function (db) {
  return new Promise(function(resolve, reject) {
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
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });

  });

}

module.exports.gen_user_rating = async function(db, user_id) {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT users.user_id as ID,
                  criterion_1.grade_1 as d1, criterion_1.grade_2 as d2,
                  criterion_2.grade_1 as d3, criterion_2.grade_2 as d4,
                  criterion_3.grade_1 as d5, criterion_3.grade_2 as d6, criterion_3.grade_3 as d7, criterion_3.grade_4 as d8,
                  criterion_4.grade_1 as d9, criterion_4.grade_2 as d10,
                  criterion_5.grade_1 as d11, criterion_5.grade_2 as d12, criterion_5.grade_3 as d13, criterion_5.grade_4 as d14, criterion_5.grade_5 as d15,
                  (criterion_1.grade_1 + criterion_1.grade_2 +
                  criterion_2.grade_1 + criterion_2.grade_2 +
                  criterion_3.grade_1 + criterion_3.grade_2 + criterion_3.grade_3 + criterion_3.grade_4 +
                  criterion_4.grade_1 + criterion_4.grade_2 +
                  criterion_5.grade_1 + criterion_5.grade_2 + criterion_5.grade_3 + criterion_5.grade_4 + criterion_5.grade_5) as d16
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
                  WHERE users.user_id = ${user_id}`;
    console.log(db);
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });

  });
}
