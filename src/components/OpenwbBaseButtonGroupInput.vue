<template>
	<openwb-base-setting-element>
		<template #title>
			<slot name="title">
				{{ title }}
			</slot>
		</template>
		<template #help>
			<slot name="help"></slot>
		</template>
		<template #default>
			<div class="btn-group btn-block btn-group-toggle">
				<label
					v-for="button in buttons"
					:key="button.value"
					class="btn"
					:class="[
						value == button.buttonValue ? 'active' : '',
						button.class ? button.class : 'btn-outline-info',
					]"
				>
					<input
						type="radio"
						v-model="value"
						:value="button.buttonValue"
						v-bind="$attrs"
					/>
					{{ button.text }}
					<font-awesome-icon
						:icon="['fas', 'check']"
						:style="[
							value == button.buttonValue
								? 'visibility: visible'
								: 'visibility: hidden',
						]"
					/>
				</label>
			</div>
		</template>
	</openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faQuestionCircle as fasQuestionCircle,
	faCheck as fasCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle, fasCheck);

export default {
	name: "OpenwbButtonGroupInput",
	inheritAttrs: false,
	props: {
		title: String,
		modelValue: { type: [String, Number, Boolean] },
		buttons: Object,
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
		OpenwbBaseSettingElement,
		FontAwesomeIcon,
	},
};
</script>
