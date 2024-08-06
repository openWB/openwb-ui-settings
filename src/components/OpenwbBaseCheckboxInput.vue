<template>
	<openwb-base-setting-element>
		<template #title>
			<slot name="title">
				{{ title }}
			</slot>
		</template>
		<template #help v-if="$slots.help">
			<slot name="help"></slot>
		</template>
		<template #default>
			<div class="col-md-8">
				<input
					class="form-control"
					type="checkbox"
					v-model="value"
					v-bind="$attrs"
				/>
			</div>
		</template>
	</openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";

export default {
	name: "OpenwbCheckboxInput",
	inheritAttrs: false,
	props: {
		title: String,
		modelValue: { type: Boolean },
	},
	emits: ["update:modelValue"],
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
	components: {
		OpenwbBaseSettingElement,
	},
};
</script>
