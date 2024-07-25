<template>
	<div class="card-text card-text-heading" v-bind="$attrs">
		<div class="heading-text" v-on:click="toggleHelp">
			<slot />
			<font-awesome-icon
				v-if="$slots.help"
				:icon="
					showHelp
						? ['fas', 'question-circle']
						: ['far', 'question-circle']
				"
				:class="showHelp ? 'text-info' : ''"
			/>
		</div>
		<span v-if="$slots.actions" class="actions">
			<slot name="actions" />
		</span>
	</div>
	<div class="">
		<span
			v-if="showHelp"
			class="form-text alert alert-info small flex-fill"
		>
			<slot name="help"></slot>
		</span>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faQuestionCircle as fasQuestionCircle,
	faCheck as fasCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle, fasCheck);

export default {
	name: "OpenwbHeading",
	inheritAttrs: false,
	components: {
		FontAwesomeIcon,
	},
	data() {
		return {
			showHelp: false,
		};
	},
	methods: {
		toggleHelp() {
			this.showHelp = !this.showHelp && this.$slots.help !== undefined;
		},
	},
};
</script>

<style scoped>
.card-text-heading {
	font-size: 125%;
	font-weight: bold;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	display: flex;
	justify-content: space-between;
}

.card-text-heading .actions {
	font-weight: normal;
	font-size: 75%;
}

.heading-text {
	cursor: default;
}
</style>
