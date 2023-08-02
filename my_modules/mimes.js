module.exports.getMimeType = function(path) {
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
