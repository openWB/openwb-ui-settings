<template>
	<div class="device-mqtt-bat">
		<openwb-base-heading>
			Einstellungen für MQTT Batteriespeicher
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Die folgenden Topics sind für einen reibungslosen Betrieb unbedingt
			erforderlich:
			<ul>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							component.id
						}}/get/power</openwb-base-copy-to-clipboard
					><br />
					Speicherleistung in Watt, Zahl mit oder ohne
					Nachkommastellen (Float, Integer) und einem Punkt als
					Dezimaltrennzeichen, positiv Ladung, negativ Entladung<br />
					Beispiel: <span class="text-info">-123</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							component.id
						}}/get/imported</openwb-base-copy-to-clipboard
					><br />
					Geladene Energie in Wh, Zahl mit oder ohne Nachkommastellen
					(Float, Integer) und einem Punkt als Dezimaltrennzeichen,
					nur positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							component.id
						}}/get/exported</openwb-base-copy-to-clipboard
					><br />
					Entladene Energie in Wh, Zahl mit oder ohne Nachkommastellen
					(Float, Integer) und einem Punkt als Dezimaltrennzeichen,
					nur positiv<br />
					Beispiel: <span class="text-info">123.45</span>
				</li>
				<li>
					<openwb-base-copy-to-clipboard
						class="text-info"
						tooltip="Topic kopieren"
						>openWB/set/bat/{{
							component.id
						}}/get/soc</openwb-base-copy-to-clipboard
					><br />
					Ladestand des Speichers, Zahl mit oder ohne Nachkommastellen
					(Float, Integer) und einem Punkt als Dezimaltrennzeichen,
					gültige Werte 0 bis 100<br />
					Beispiel: <span class="text-info">95</span>
				</li>
			</ul>
		</openwb-base-alert>
	</div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
	name: "DeviceMqttBat",
	mixins: [ComponentConfigMixin],
};
</script>
