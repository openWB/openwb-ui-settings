<template>
	<openwb-base-alert v-if="displayTheme.official" subtype="success">
		<font-awesome-icon fixed-width :icon="['fas', 'certificate']" />
		Das ausgewählte Theme wird von openWB gepflegt.
	</openwb-base-alert>
	<openwb-base-alert v-else subtype="info">
		<font-awesome-icon fixed-width :icon="['fas', 'people-group']" />
		Das ausgewählte Theme wird in unserer Community gepflegt. Rückfragen
		oder Probleme bitte im Forum diskutieren.
	</openwb-base-alert>
	<component
		:is="myComponent"
		:displayTheme="displayTheme"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faPeopleGroup as fasPeopleGroup,
	faCertificate as fasCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPeopleGroup, fasCertificate);

import { defineAsyncComponent } from "vue";
import OpenwbDisplayThemeFallback from "./OpenwbDisplayThemeFallback.vue";

export default {
	name: "OpenwbDisplayThemeProxy",
	emits: ["update:configuration"],
	props: {
		displayTheme: { type: Object, required: true },
	},
	components: {
		FontAwesomeIcon,
	},
	computed: {
		myComponent() {
			console.debug(`loading display theme: ${this.displayTheme.type}`);
			return defineAsyncComponent({
				loader: () =>
					import(`./${this.displayTheme.type}/displayTheme.vue`),
				errorComponent: OpenwbDisplayThemeFallback,
			});
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
