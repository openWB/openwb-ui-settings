// load all *.vue files in this folder and export them as modules
const files = require.context(".", false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
	if (key === "./index.js") return;
	modules[key.replace(/(\.\/|\.vue)/g, "")] = files(key).default;
});
console.debug("installed modules:", modules);
export default modules;
