<template>
	<div class="load-management-config">
		<openwb-base-card
			title="Einstellungen"
			:collapsible="true"
			:collapsed="false"
		>
			<openwb-base-heading>ToDo...</openwb-base-heading>
		</openwb-base-card>
		<openwb-base-card
			title="Struktur"
			:collapsible="true"
			:collapsed="true"
		>
			<!-- ToDo: Fix: nested lists bypass store commits! -->
			<sortable-list
				title="Anordnung der Komponenten"
				:model-value="$store.state.mqtt['openWB/counter/get/hierarchy']"
				@update:model-value="
					updateState('openWB/counter/get/hierarchy', $event)
				"
			>
				<template #help>
					<pre>{{
						JSON.stringify(
							$store.state.mqtt["openWB/counter/get/hierarchy"],
							undefined,
							2
						)
					}}</pre>
				</template>
			</sortable-list>
		</openwb-base-card>

		<openwb-base-submit-buttons
			@save="$emit('save')"
			@reset="$emit('reset')"
			@defaults="$emit('defaults')"
		/>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import SortableList from "@/components/OpenwbSortableList.vue";

export default {
	name: "LoadManagementConfig",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	components: {
		SortableList,
	},
	data() {
		return {
			mqttTopicsToSubscribe: ["openWB/counter/get/hierarchy"],
		};
	},
};
</script>

<style></style>
