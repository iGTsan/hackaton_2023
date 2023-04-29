const db_funcs = require("./db");

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

function proc_id(params) {
  console.log("Hi");
}

function proc_input(params) {
  try {
    let db_promise = db_funcs.open("database.db");
    db_promise.then((db) => {
      let add_promise = db_funcs.add_grade(db,
         params["user_id"], params["crit"], params["podcrit"], params["grade"]);
      add_promise.then( () => {
        db_funcs.get_rating(db);
      })
    })
  } catch (err) {
    console.log(err.message);
  }
}

const FORMS_ROUTE = {
  // '1' : proc_id,
  '2' : proc_input
}

module.exports.proc_params = async function(params) {
  form_id = 'form_id';
  if (params[form_id] in FORMS_ROUTE)
    FORMS_ROUTE[params[form_id]](params);
}
