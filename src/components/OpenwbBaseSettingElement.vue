<template>
	<div class="form-row mb-1 align-items-baseline">
		<label
			v-if="$slots.title"
			v-on:click="toggleHelp"
			class="col-md-4 col-form-label"
		>
			<slot name="title"></slot>
			<font-awesome-icon
				v-if="$slots.help"
				:icon="
					showHelp
						? ['fas', 'question-circle']
						: ['far', 'question-circle']
				"
				class="ml-1"
				:class="showHelp ? 'text-info' : ''"
			/>
		</label>
		<div class="col-md-8">
			<div class="form-row">
				<slot>*Element missing*</slot>
			</div>
			<div class="form-row">
				<span
					v-if="showHelp"
					class="form-text alert alert-info my-1 small flex-fill"
				>
					<slot name="help">*Help Text*</slot>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuestionCircle as fasQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle);

export default {
	name: "OpenwbBaseSettingElement",
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
	components: {
		FontAwesomeIcon,
	},
};
</script>
