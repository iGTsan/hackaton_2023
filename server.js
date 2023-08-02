const http = require("http");
const db_funcs = require("./my_modules/db");
const fs = require("fs");
const request_proc = require("./my_modules/request_proc");
const files_proc = require("./my_modules/files");
const mimes = require("./my_modules/mimes");

const rootPages = "./pages"

const server = http.createServer();


server.on('request', async (request, response) => {
	// console.log(request.url);
  const urlRegExp = /^[^?]+/;
  const url = request.url.match(urlRegExp)[0];

	if (request.method == "POST") {
		// request.setTimeout(2000, process_post);
		files_proc.ProcessPost(request, response);
	} if (url != '/favicon.ico') {
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
      		response.writeHead(status, {'Content-Type': mimes.getMimeType(path)});
      		response.write(text);
      		response.end();
        } else {
    			status = 200;
    			text = fs.promises.readFile(path);
          text.then( (text) => {
        		response.writeHead(status, {'Content-Type': mimes.getMimeType(path)});
        		response.write(text);
        		response.end();
          }, (err) => {
            console.log('error', url);
            console.log(err);
            text ='<h1>Page not found </h1>';
            path = '.html';
            status = 404;
        		response.writeHead(status, {'Content-Type': mimes.getMimeType(path)});
        		response.write(text);
        		response.end();
          })
        }
      })
    })
	} else {
    response.end();
  }
})

server.listen(3000);
