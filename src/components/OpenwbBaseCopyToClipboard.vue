<template>
	<span
		:title="clipboardApiAvailable ? tooltip : ''"
		:class="clipboardApiAvailable ? 'copy-me' : ''"
		@click="click"
	>
		<slot />
		<font-awesome-icon
			v-if="clipboardApiAvailable"
			fixed-width
			:icon="isCopied ? ['fas', 'clipboard-check'] : ['fas', 'clipboard']"
		/>
	</span>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faClipboard as fasClipboard,
	faClipboardCheck as fasClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasClipboard, fasClipboardCheck);

export default {
	name: "OpenwbCopyToClipboard",
	components: {
		FontAwesomeIcon,
	},
	props: {
		tooltip: { type: String, default: "Wert kopieren" },
	},
	data() {
		return {
			clipboardApiAvailable: navigator.clipboard != undefined,
			isCopied: false,
		};
	},
	methods: {
		click(event) {
			console.debug("copyToClipboard", event.target.innerText);
			if (this.clipboardApiAvailable) {
				navigator.clipboard.writeText(event.target.innerText).then(
					() => {
						this.isCopied = true;
					},
					() => {
						console.error("copy to clipboard failed");
					}
				);
			}
		},
	},
};
</script>

<style scoped>
span.copy-me {
	cursor: copy;
}
</style>
