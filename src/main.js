import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import VueAxios from "vue-axios";

const vApp = createApp(App);
vApp.use(store).use(router).use(VueAxios, axios);

// automatic global registering of our base components
const requireComponent = require.context(
	// The relative path of the components folder
	"@/components",
	// Whether or not to look in sub folders
	false,
	// The regular expression used to match base component filenames
	/OpenwbBase[A-Za-z]+\.(vue)$/
);

requireComponent.keys().forEach((fileName) => {
	// Get component config
	const componentConfig = requireComponent(fileName);

	// Get PascalCase name of component
	const componentName = upperFirst(
		camelCase(
			// Gets the file name regardless of folder depth
			fileName
				.split("/")
				.pop()
				.replace(/\.\w+$/, "")
		)
	);

	console.debug("global registering of component", componentName);
	vApp.component(
		componentName,
		// Look for the component options on `.default`, which will
		// exist if the component was exported with `export default`,
		// otherwise fall back to module's root.
		componentConfig.default || componentConfig
	);
});

vApp.mount("#app");
