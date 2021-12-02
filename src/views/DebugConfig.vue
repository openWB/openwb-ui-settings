<template>
	<div class="debugging">
		<openwb-base-card title="Protokollierung">
			<div v-if="$store.state.mqtt['openWB/general/extern'] === true">
				<openwb-base-alert subtype="info">
					Diese Einstellungen sind nicht verfügbar, solange sich diese
					openWB im Modus "Nur Ladepunkt" befindet.
				</openwb-base-alert>
			</div>
			<div v-else>
				<openwb-base-button-group-input
					title="Debug Level"
					:buttons="[
						{ buttonValue: 0, text: 'Aus (0)' },
						{ buttonValue: 1, text: 'Info (1)' },
						{ buttonValue: 2, text: 'Details (2)' },
					]"
					:model-value="
						$store.state.mqtt['openWB/system/debug_level']
					"
					@update:model-value="
						updateState('openWB/system/debug_level', $event)
					"
				>
					<template #help>
						Wenn der Debug Level auf "Info" oder "Details" gesetzt
						wird, werden mehr Informationen in die Logdateien
						geschrieben.<br />
						Im normalen Betrieb sollte immer "Aus" gewählt werden,
						um die Schreibvorgänge auf der SD-Karte zu reduzieren.
					</template>
				</openwb-base-button-group-input>
			</div>
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

export default {
	name: "Debugging",
	mixins: [ComponentStateMixin],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/system/debug_level",
			],
		};
	},
};
</script>