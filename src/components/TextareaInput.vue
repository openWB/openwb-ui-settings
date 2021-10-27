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
			<div class="form-row justify-content-end">
				<textarea
					v-if="subtype === 'json'"
					class="form-control"
					v-model="value"
					v-bind="$attrs"
				></textarea>
				<textarea
					v-else
					class="form-control"
					v-model="value"
					v-bind="$attrs"
				></textarea>
				<small
					v-if="$attrs.maxlength"
					class="form-text text-muted text-right"
				>
					{{ length }} / {{ $attrs.maxlength }}
				</small>
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
	name: "TextareaInput",
	inheritAttrs: false,
	props: {
		title: String,
		modelValue: { String, Object },
		subtype: {
			validator: function (value) {
				return ["text", "json"].indexOf(value) !== -1;
			},
			default: "text",
		},
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
				if (this.subtype == "json") {
					return JSON.stringify(this.modelValue, undefined, 2);
				}
				return this.modelValue;
			},
			set(newValue) {
				if (this.subtype == "json") {
					try {
						this.$emit("update:modelValue", JSON.parse(newValue));
					} catch (e) {
						console.error("parsing JSON failed: " + newValue);
					}
				} else {
					this.$emit("update:modelValue", newValue);
				}
			},
		},
		length: {
			get() {
				if (this.value !== undefined) {
					return this.value.length;
				} else {
					return 0;
				}
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
