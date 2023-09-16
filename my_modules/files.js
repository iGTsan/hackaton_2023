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

async function excel_add_users(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;

  try {
    let db_grades_promise = db_funcs.open("database");
    let db_users_promise = db_funcs.open("users");
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

function confirm_test_results(results, crit) {
  results.forEach((row) => {
    let params = {
      'form_id' : 'update_tests'
    };
    params['user_id'] = row[0];
    params['crit'] = crit;
    params['podcrit_1'] = row[1];
    if (row.length > 2) {
      params['podcrit_2'] = row[2];
    }
    if (row.length > 3) {
      params['podcrit_3'] = row[3];
    }
    request_proc.proc_params(params);
  });
}

function confirm_test_w_names_results(results, crit) {
  results.forEach((row) => {
    let params = {
      'form_id' : 'update_tests'
    };
    params['user_id'] = row[0];
    params['crit'] = crit;
    params['name'] = row[1];
    params['podcrit_1'] = row[2];
    if (row.length > 3) {
      params['podcrit_2'] = row[3];
    }
    if (row.length > 4) {
      params['podcrit_3'] = row[4];
    }
    request_proc.proc_params(params);
  });
}

async function crit_1_year_1(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;
  const grades = await xlsx_parse.ID_grade_parse(filename);
  fs.unlinkSync(filename);

  confirm_test_results(grades, 1);
}

async function crit_1_year_2(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;
  const grades = await xlsx_parse.ID_grade_grade_grade_parse(filename);
  fs.unlinkSync(filename);
  
  confirm_test_results(grades, 1);
}

async function crit_2_year_1(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;
  const grades = await xlsx_parse.ID_name_grade_parse(filename);
  fs.unlinkSync(filename);
  
  confirm_test_w_names_results(grades, 2);
}

async function crit_2_year_2(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;
  const grades = await xlsx_parse.ID_name_grade_parse(filename);
  fs.unlinkSync(filename);
  
  confirm_test_w_names_results(grades, 2);
}

async function crit_6(files, fields, cnt) {
  if (cnt != 1)
    return;

  const filename = files['file_add_admin'].filepath;
  const grades = await xlsx_parse.ID_name_grade_parse(filename);
  fs.unlinkSync(filename);
  
  confirm_test_w_names_results(grades, 6);
}

const FORMS_ROUTE = {
  '1_crit_1_year' : crit_1_year_1,
  '1_crit_2_year' : crit_1_year_2,
  '2_crit_1_year' : crit_2_year_1,
  '2_crit_2_year' : crit_2_year_2,
  '6_crit' : crit_6,
  'excel_parse_tests' : excel_parse_tests,
  'excel_parse' : excel_add_users,
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
