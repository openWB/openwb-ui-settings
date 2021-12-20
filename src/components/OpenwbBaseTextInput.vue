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
								v-if="subtype == 'email'"
								:icon="['fas', 'envelope']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'host'"
								:icon="['fas', 'network-wired']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'url'"
								:icon="['fas', 'globe']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'user'"
								:icon="['fas', 'user']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'json'"
								:icon="['fas', 'code']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'password'"
								:icon="
									showPassword
										? ['fas', 'unlock']
										: ['fas', 'lock']
								"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'time'"
								:icon="['fas', 'clock']"
							/>
							<font-awesome-icon
								fixed-width
								v-if="subtype == 'date'"
								:icon="['fas', 'calendar-day']"
							/>
						</div>
					</div>
					<input
						v-if="['text', 'user'].includes(subtype)"
						type="text"
						class="form-control"
						:class="{ invalid: inputInvalid }"
						v-model="value"
						v-bind="$attrs"
						:pattern="pattern"
					/>
					<input
						v-if="subtype == 'json'"
						ref="jsonInput"
						type="text"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
						:pattern="pattern"
					/>
					<input
						v-if="subtype == 'password'"
						:type="showPassword ? 'text' : 'password'"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
						:pattern="pattern"
					/>
					<input
						v-if="subtype == 'host'"
						type="text"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="['email', 'url'].includes(subtype)"
						:type="subtype"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<div
						v-if="subtype == 'password'"
						class="input-group-append clickable"
						@click="togglePassword"
					>
						<div class="input-group-text">
							<font-awesome-icon
								fixed-width
								:icon="
									showPassword
										? ['far', 'eye']
										: ['far', 'eye-slash']
								"
							/>
						</div>
					</div>
					<input
						v-if="subtype == 'time'"
						type="time"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="subtype == 'date'"
						type="date"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
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
	faKeyboard as fasKeyboard,
	faEnvelope as fasEnvelope,
	faNetworkWired as fasNetworkWired,
	faGlobe as fasGlobe,
	faUser as fasUser,
	faCode as fasCode,
	faLock as fasLock,
	faUnlock as fasUnlock,
	faClock as fasClock,
	faCalendarDay as fasCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import {
	faQuestionCircle as farQuestionCircle,
	faEye as farEye,
	faEyeSlash as farEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasQuestionCircle,
	farQuestionCircle,
	fasKeyboard,
	fasEnvelope,
	fasNetworkWired,
	fasGlobe,
	fasUser,
	fasCode,
	fasLock,
	fasUnlock,
	fasClock,
	fasCalendarDay,
	farEye,
	farEyeSlash
);

export default {
	name: "TextInput",
	inheritAttrs: false,
	props: {
		title: String,
		modelValue: { type: [String, Object] },
		subtype: {
			validator: function (value) {
				return (
					[
						"text",
						"email",
						"host",
						"url",
						"user",
						"json",
						"password",
						"time",
						"date",
					].indexOf(value) !== -1
				);
			},
			default: "text",
		},
		pattern: String,
	},
	emits: ["update:modelValue"],
	data() {
		return {
			showHelp: false,
			showPassword: false,
			inputInvalid: false,
			tempValue: this.modelValue,
		};
	},
	computed: {
		value: {
			get() {
				if (this.subtype == "json") {
					if (this.inputInvalid) {
						console.warn("returning invalid String");
						return this.tempValue;
					} else {
						return JSON.stringify(this.tempValue);
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
						console.error("parsing JSON failed: " + newValue);
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
	},
	methods: {
		toggleHelp() {
			this.showHelp = !this.showHelp && this.$slots.help !== undefined;
		},
		togglePassword() {
			this.showPassword = !this.showPassword;
		},
	},
	components: {
		FontAwesomeIcon,
	},
};
</script>

<style scoped>
.clickable {
	cursor: pointer;
}

input:invalid {
	background-color: pink;
}
</style>
