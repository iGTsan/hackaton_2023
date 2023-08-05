const fs = require("fs");
const formidable = require('formidable');
const db_funcs = require('./db')
const request_proc = require('./request_proc')
const xlsx_parse = require('./xlsx_parse')

const UPLOAD_DIR = "./uploads"


async function rename_file(newName, file) {
  const oldPath = file.filepath;
  const newPath = UPLOAD_DIR + '/' + newName;

  // Переименовываем загруженный файл в file.txt
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(`Error while renaming file ${newPath}`);
      return;
    }
  });
}

async function user_file_upload(files, fields, cnt) {
  if (cnt != 2)
    return;

  rename_file(`id_${fields['user_id']}-${fields['form_id']}-1`, files['file_add1']);
  rename_file(`id_${fields['user_id']}-${fields['form_id']}-2`, files['file_add2']);

  // console.log(fields);
  // request_proc.proc_params(fields);
}

async function excel_parse(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;

  try {
    let db_grades_promise = db_funcs.open("database.db");
    let db_users_promise = db_funcs.open("users.db");
    db_grades_promise.then((db_grades) => {
      db_users_promise.then((db_users) => {
        db_funcs.add_users(db_grades, db_users, filename).then((add_promise) => {
          fs.unlinkSync(filename);
        });
      })
    })
  } catch (err) {
    console.log(err.message);
  }


}

async function excel_parse_tests(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;
  const grades = await xlsx_parse.parse_for_grades(filename);
  fs.unlinkSync(filename);

  grades.forEach((row) => {
    let params = {
      'form_id' : 'update_tests'
    };
    params['user_id'] = row[0];
    params['grade'] = row[1];
    request_proc.proc_params(params);
  });
}

const FORMS_ROUTE = {
  // '1' : proc_id,
  // '2' : hr_update_grades,
  // '3' : admin_update_grades,
  // '4' : hr_file_upload,
  // '5' : user_file_upload,
  // '6' : update_rating,
  // 'login' : user_login,
  'excel_parse_tests' : excel_parse_tests,
  'excel_parse' : excel_parse,
  'crit_5' : user_file_upload
}

module.exports.ProcessPost = async function(request, response) {
	const form = formidable({ multiples: true, uploadDir : UPLOAD_DIR});
	// console.log(request);
	form.parse(request, (err, fields, files) => {
		if (err) {
			response.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
			response.end(String(err));
			return;

		}
		// console.log(files);
		// console.log(fields);
		let cnt = 0
		for (const key of Object.keys(files)) {
	    cnt++;
		}

    form_id = 'form_id';
    if (fields[form_id] in FORMS_ROUTE)
      return FORMS_ROUTE[fields[form_id]](files, fields, cnt);
    else
      console.log(fields);
	});

	return;
}
