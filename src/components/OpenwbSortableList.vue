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
		<openwb-nested-list
			v-if="value !== undefined"
			v-model="value"
			:labels="labels"
		/>
		<div v-else>Warte auf Daten...</div>
	</openwb-base-setting-element>
</template>

<script>
import OpenwbBaseSettingElement from "./OpenwbBaseSettingElement.vue";
import OpenwbNestedList from "./OpenwbNestedList.vue";

export default {
	name: "OpenwbSortableList",
	props: {
		id: String,
		title: String,
		modelValue: Object,
		labels: { type: Object, default: undefined },
	},
	emits: ["update:modelValue"],
	components: {
		OpenwbBaseSettingElement,
		OpenwbNestedList,
	},
	computed: {
		value: {
			get() {
				return this.modelValue;
			},
			set(newValue) {
				console.debug("update in sortableList", newValue);
				this.$emit("update:modelValue", newValue);
			},
		},
	},
};
</script>
