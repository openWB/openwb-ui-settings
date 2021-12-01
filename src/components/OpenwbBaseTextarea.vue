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
								v-if="subtype == 'text'"
								:icon="['fas', 'keyboard']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'json'"
								:icon="['fas', 'code']"
							/>
						</div>
					</div>
					<textarea
						ref="jsonInput"
						v-if="subtype === 'json'"
						class="form-control"
						v-model.lazy="value"
						v-bind="$attrs"
					></textarea>
					<textarea
						v-else
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					></textarea>
					<div v-if="$attrs.maxlength" class="input-group-append">
						<div class="input-group-text">
							<small class="form-text text-muted text-right">
								{{ length }} / {{ $attrs.maxlength }}
							</small>
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
			inputInvalid: false,
			tempValue: this.modelValue,
		};
	},
	computed: {
		value: {
			get() {
				if (this.subtype == "json") {
					if (this.inputInvalid) {
						console.debug("returning invalid String");
						return this.tempValue;
					} else {
						return JSON.stringify(this.tempValue, undefined, 2);
					}
				}
				return this.modelValue;
			},
			set(newValue) {
				if (this.subtype == "json") {
					try {
						let myNewJsonValue = JSON.parse(newValue);
						this.inputInvalid = false;
						this.$refs.jsonInput.setCustomValidity("");
						this.tempValue = myNewJsonValue;
						this.$emit("update:modelValue", myNewJsonValue);
					} catch (e) {
						console.warn("parsing JSON failed: " + newValue);
						this.inputInvalid = true;
						this.$refs.jsonInput.setCustomValidity(
							"Ungültiger JSON Ausdruck!"
						);
						this.tempValue = newValue;
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

<style scoped>
textarea:invalid {
	background-color: pink;
}
</style>
