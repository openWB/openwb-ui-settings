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
				<openwb-nested-list
					v-if="value !== undefined"
					v-model="value"
					:labels="labels"
				/>
				<div v-else>Warte auf Daten...</div>
			</div>
			<span v-if="showHelp" class="form-row alert alert-info my-1 small">
				<slot name="help"></slot>
			</span>
		</div>
	</div>
</template>

<script>
import OpenwbNestedList from "@/components/OpenwbNestedList.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuestionCircle as fasQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle);

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
		FontAwesomeIcon,
		OpenwbNestedList,
	},
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
				// this will never happen, as draggable component does not emit updates!
				console.log("update in sortableList", newValue);
				this.$emit("update:modelValue", newValue);
			},
		},
	},
	methods: {
		toggleHelp() {
			this.showHelp = !this.showHelp && this.$slots.help !== undefined;
		},
	},
};
</script>
