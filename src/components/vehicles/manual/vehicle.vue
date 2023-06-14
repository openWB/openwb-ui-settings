<template>
	<div class="vehicle-soc-tesla">
		<openwb-base-heading>
			Einstellungen für manuellen SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Beim Anstecken des Fahrzeugs muss der aktuelle SoC über die
			Hauptseite angegeben werden. Anhand des Zählers im Ladepunkt wird
			dann der aktuelle SoC errechnet. Ausschlaggebend für die Qualität
			dieses Moduls sind die beiden Einstellungen "Kapazität der Batterie"
			in der Fahrzeug-Vorlage und "Wirkungsgrad der Ladeelektronik".
		</openwb-base-alert>
		<openwb-base-number-input
			title="Wirkungsgrad der Ladeelektronik"
			unit="%"
			required
			:model-value="configuration.efficiency * 100"
			@update:model-value="
				updateConfiguration($event / 100, 'configuration.efficiency')
			"
		>
			<template #help>
				Durch Verluste in der Ladeelektronik (z. B. Umwandlung
				Wechselspannung in Gleichspannung) gelangt nicht die komplette
				Energie, welche durch den Zähler in der Wallbox gemessen wird,
				in den Akku des Fahrzeugs. Der anzugebende Wert liegt bei
				gängigen Fahrzeugen im Bereich 90-95%. Eine Ausnahme stellt der
				Zoe dar, dessen Chameleonlader je nach Modellversion und
				freigegebener Leistung der Wallbox teilweise nur auf ca. 50%
				kommt.<br />
				Liegen die Angaben der Wallbox und des Fahrzeugs nach der Ladung
				mehrere Prozent auseinander, dann kann mit dieser Einstellung
				eine Feinabstimmung erfolgen: <br />
				SoC an der Wallbox zu hoch: Wirkungsgrad um ein paar Prozent
				reduzieren<br />
				SoC an der Wallbox zu gering: Wirkungsgrad um ein paar Prozent
				erhöhen<br />
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "VehicleSocManual",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		vehicleId: { required: true },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
