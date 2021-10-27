// load all *.vue files in this folder and export them as modules
const files = require.context(".", false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
	// skip this file
	if (key === "./index.js") return;
	// add any other file
	modules[key.replace(/(\.\/|\.vue)/g, "")] = files(key).default;
});
console.debug("installed component modules:", modules);
export default modules;
