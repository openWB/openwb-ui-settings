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
								v-if="
									subtype == 'date' ||
									subtype == 'month' ||
									subtype == 'year'
								"
								:icon="['fas', 'calendar-day']"
							/>
						</div>
					</div>
					<input
						v-if="['text', 'user'].includes(subtype)"
						ref="textInput"
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
						ref="passwordInput"
						:type="showPassword ? 'text' : 'password'"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
						:pattern="pattern"
					/>
					<input
						v-if="subtype == 'host'"
						ref="hostInput"
						type="text"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="['email', 'url'].includes(subtype)"
						refs="urlInput"
						:type="subtype"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="subtype == 'time'"
						ref="timeInput"
						type="time"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="subtype == 'date'"
						type="date"
						ref="dateInput"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="subtype == 'month'"
						type="month"
						ref="monthInput"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<input
						v-if="subtype == 'year'"
						type="number"
						ref="yearInput"
						class="form-control"
						v-model="value"
						v-bind="$attrs"
					/>
					<div v-if="unit" class="input-group-append">
						<div class="input-group-text">
							{{ unit }}
						</div>
					</div>
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
					<div
						v-if="
							showQuickButtons &&
							(subtype == 'date' ||
								subtype == 'month' ||
								subtype == 'year')
						"
						class="input-group-append clickable"
						@click="modify(-1)"
					>
						<div class="input-group-text">-</div>
					</div>
					<div
						v-if="
							showQuickButtons &&
							(subtype == 'date' ||
								subtype == 'month' ||
								subtype == 'year')
						"
						class="input-group-append clickable"
						@click="modify(1)"
					>
						<div class="input-group-text">+</div>
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
	farEyeSlash,
);

export default {
	name: "OpenwbTextInput",
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
						"month",
						"year",
					].indexOf(value) !== -1
				);
			},
			default: "text",
		},
		pattern: String,
		unit: String,
		emptyValue: { required: false, default: null },
		showQuickButtons: { type: Boolean, default: false },
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
							"Ungültiger JSON Ausdruck!",
						);
						this.tempValue = newValue;
					}
				} else {
					if (newValue == "") {
						newValue = this.emptyValue;
					}
					this.$emit("update:modelValue", newValue);
				}
			},
		},
		inputRef() {
			switch (this.subtype) {
				case "json":
					return this.$refs.jsonInput;
				case "password":
					return this.$refs.passwordInput;
				case "host":
					return this.$refs.hostInput;
				case "email":
				case "url":
					return this.$refs.urlInput;
				case "time":
					return this.$refs.timeInput;
				case "date":
					return this.$refs.dateInput;
				case "month":
					return this.$refs.monthInput;
				case "year":
					return this.$refs.yearInput;
			}
			// default to textInput
			return this.$refs.textInput;
		},
	},
	methods: {
		toggleHelp() {
			this.showHelp = !this.showHelp && this.$slots.help !== undefined;
		},
		togglePassword() {
			this.showPassword = !this.showPassword;
		},
		modify(offset) {
			var newValue;
			var newDate = new Date(this.modelValue);
			switch (this.subtype) {
				case "date":
					newDate.setDate(newDate.getDate() + offset);
					newValue =
						String(newDate.getFullYear()) +
						"-" +
						String(newDate.getMonth() + 1).padStart(2, "0") +
						"-" +
						String(newDate.getDate()).padStart(2, "0");
					break;
				case "month":
					newDate.setMonth(newDate.getMonth() + offset);
					newValue =
						String(newDate.getFullYear()) +
						"-" +
						String(newDate.getMonth() + 1).padStart(2, "0");
					break;
				case "year":
					newDate.setYear(newDate.getFullYear() + offset);
					newValue = String(newDate.getFullYear());
					break;
				default:
					console.warn(
						`cannot modify input of subtype '${this.subtype}'`,
					);
					return;
			}
			if (newValue > this.inputRef.max || newValue < this.inputRef.min) {
				return;
			}
			this.value = newValue;
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
