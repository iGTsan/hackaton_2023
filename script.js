const sqlite3 = require('sqlite3').verbose();
const xlsx_parse = require("./xlsx_parse");

let db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

function test() {
  const TABLE_STRUCT = {
    "users" : "users(user_id, fir, sec, thi, fou, fif) VALUES(?, ?, ?, ?, ?, ?)",
    "fir" : "fir(user_id) VALUES(?)",
    "sec" : "sec(user_id) VALUES(?)",
    "thi" : "thi(user_id) VALUES(?)",
    "fou" : "fou(user_id) VALUES(?)",
    "fif" : "fif(user_id) VALUES(?)",
  };

  function insert_row(tablename, values) {
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


  for (let i = 0; i < 10; i++) {
  let input = []
    for (let j = 0; j < 6; j++) {
      input.push(i);
    }
    insert_row("users", input);
  }


  let sql = `SELECT * FROM users`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}

let data = xlsx_parse.parse("test.xlsx");
data.then((value) => {
  console.log(1, value);
})
data = xlsx_parse.parse("test2.xlsx");
data.then((value) => {
  console.log(2, value);
})

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
