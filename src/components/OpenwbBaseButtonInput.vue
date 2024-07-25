<template>
	<openwb-base-setting-element>
		<template #title>{{ title }}</template>
		<template #help>
			<slot name="help"></slot>
		</template>
		<template #default>
			<openwb-base-click-button
				:class="(disabled ? 'btn-outline-' : 'btn-') + subtype"
				:disabled="disabled"
				v-bind="$attrs"
				@buttonClicked.stop="handleClick"
			>
				{{ buttonText }}
			</openwb-base-click-button>
		</template>
	</openwb-base-setting-element>
</template>

<script>
export default {
	name: "OpenwbButtonInput2",
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
	emits: ["buttonClicked"],
	methods: {
		handleClick(event) {
			this.$emit("buttonClicked", event);
		},
	},
};
</script>
