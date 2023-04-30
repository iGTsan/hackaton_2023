const http = require("http");
const fs = require("fs");
const db_funcs = require("./my_modules/db");
const request_proc = require("./my_modules/request_proc");

const rootPages = "./pages"

function getMimeType(path) {
	let mimes = {
		html: 'text/html',
		jpeg: 'image/jpeg',
		jpg: 'image/jpeg',
		png: 'image/png',
		svg: 'image/svg+xml',
		json: 'application/json',
		js: 'text/javascript',
		css: 'text/css',
		ico: 'image/x-icon',
	};
	const exts = Object.keys(mimes);
	const extReg = new RegExp('\\.(' + exts.join('|') + ')$');
	const path_match = path.match(extReg);
	let ext = null;
	if (path_match)
		ext = path_match[1];
	if (ext) {
		return mimes[ext];
	} else {
		return 'text/html';
	}
}

http.createServer(async (request, response) => {
	// console.log(request.url);
  const urlRegExp = /^[^?]+/;
  const url = request.url.match(urlRegExp)[0];
	if (url != '/favicon.ico') {
		let path = rootPages+url;
		let text;
		let status;
    let proc_result = null;
    let params_promice = request_proc.parse_params(request.url);
    params_promice.then((params) => {
      if (params) {
        proc_result = request_proc.proc_params(params);
      }
      proc_result.then( (result) => {
        if (result) {
          text = result;
          status = 200;
      		response.writeHead(status, {'Content-Type': getMimeType(path)});
      		response.write(text);
      		response.end();
        } else {
          try{
      			status = 200;
      			text = fs.promises.readFile(path);
      		}
      		catch (err) {
      			console.log('error', url);
      			console.log(err);
      			text = new Promise(function(resolve, reject) {
              resolve('<h1>Page not found </h1>');
            });
            path = '.html';
      			status = 404;
      		}
          text.then( (text) => {
        		response.writeHead(status, {'Content-Type': getMimeType(path)});
        		response.write(text);
        		response.end();
          })
        }
      })
    })
	}
}).listen(3000);
