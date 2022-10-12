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
				<div class="input-group">
					<div class="input-group-prepend">
						<div class="input-group-text">
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'calculator']"
							/>
						</div>
					</div>
					<input
						type="number"
						class="form-control"
						v-model.number="value"
						v-bind="$attrs"
					/>
					<div v-if="unit" class="input-group-append">
						<div class="input-group-text">
							{{ unit }}
						</div>
					</div>
				</div>
			</div>
			<span v-if="showHelp" class="form-row alert alert-info my-1 small">
				<slot name="help"></slot>
			</span>
		</div>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faQuestionCircle as fasQuestionCircle,
	faCalculator as fasCalculator,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle, fasCalculator);

export default {
	name: "OpenwbNumberInput",
	inheritAttrs: false,
	props: {
		title: String,
		modelValue: { type: Number },
		unit: String,
		emptyValue: { required: false, default: null },
	},
	emits: ["update:modelValue"],
	data() {
		return {
			showHelp: false,
		};
	},
	computed: {
		value: {
			get() {
				return this.modelValue;
			},
			set(newValue) {
				if (isNaN(newValue) || typeof newValue != "number") {
					newValue = this.emptyValue;
				}
				this.$emit("update:modelValue", newValue);
			},
		},
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

<style scoped>
input.invalid,
input:invalid {
	background-color: pink;
}

/* hide spinner buttons if input element is readonly or disabled */
/* Chrome, Safari, Edge, Opera */
input[readonly]::-webkit-outer-spin-button,
input[readonly]::-webkit-inner-spin-button,
input[disabled]::-webkit-outer-spin-button,
input[disabled]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[readonly][type="number"],
input[disabled][type="number"] {
	-moz-appearance: textfield;
}
</style>
