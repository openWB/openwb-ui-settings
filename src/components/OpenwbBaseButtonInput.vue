<template>
	<div class="form-row mb-1">
		<label v-on:click="toggleHelp" class="col-md-4 col-form-label">
			{{ title }}
			<font-awesome-icon
				v-if="$slots.help"
				:icon="
					showHelp
						? ['fas', 'question-circle']
						: ['far', 'question-circle']
				"
				:class="showHelp ? 'text-info' : ''"
			/>
		</label>
		<div class="col-md-8">
			<div class="form-row">
				<openwb-base-click-button
					:class="(disabled ? 'btn-outline-' : 'btn-') + subtype"
					:disabled="disabled"
					v-bind="$attrs"
					@buttonClicked="handleClick"
				>
					<slot>{{ buttonText }}</slot>
				</openwb-base-click-button>
			</div>
			<span v-if="showHelp" class="form-row alert alert-info my-1 small">
				<slot name="help"></slot>
			</span>
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
	name: "OpenwbButtonInput",
	inheritAttrs: false,
	props: {
		title: String,
		buttonText: String,
		disabled: { type: Boolean, default: false },
		subtype: {
			type: String,
			validator: function (value) {
				return (
					[
						"info",
						"success",
						"warning",
						"danger",
						"primary",
						"secondary",
						"light",
						"dark",
					].indexOf(value) !== -1
				);
			},
			default: "secondary",
		},
	},
	data() {
		return {
			showHelp: false,
		};
	},
	emits: ["buttonClicked"],
	methods: {
		toggleHelp() {
			this.showHelp = !this.showHelp && this.$slots.help !== undefined;
		},
		handleClick(event) {
			this.$emit("buttonClicked", event);
		},
	},
	components: {
		FontAwesomeIcon,
	},
};
</script>
