const http = require("http");
const fs = require("fs");
const db_funcs = require("./my_modules/db");
const request_proc = require("./my_modules/request_proc");


const routes = {
"/" : "/index.html",
};
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
		return 'text/plain';
	}
}

http.createServer(async (request, response) => {
	// console.log(request.url);
  const urlRegExp = /^[^?]+/;
  const url = request.url.match(urlRegExp)[0];
	if (url != '/favicon.ico') {
		let path = (url in routes) ? rootPages+routes[url] : rootPages+url;
		let text;
		let status;
    if (request.url != url) {
      let params_promice = request_proc.parse_params(request.url);
      params_promice.then((params) => {
        if (params) {
          request_proc.proc_params(params);
        }
      })
    }
		try{
			status = 200;
			text = await fs.promises.readFile(path);
		}
		catch (err) {
			console.log('error', url);
			console.log(err);
			text = '<h1>Page not found </h1>';
      path = '.html';
			status = 404;
		}
		response.writeHead(status, {'Content-Type': getMimeType(path)});
		response.write(text);
		response.end();
	}
}).listen(3000);
