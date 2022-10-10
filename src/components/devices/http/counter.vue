<template>
	<div class="device-http-counter">
		<openwb-base-heading>
			Einstellungen für Http Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Pfad für Leistung"
			subtype="text"
			required
			pattern="^/[-a-zA-Z0-9@:%_\+.~#?&/=]*"
			:model-value="configuration.power_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.power_path')
			"
		>
			<template #help>
				Diese Angabe wird an die Server-URL angehängt und muss mit einem
				Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Leistung in Watt darstellt.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Pfad für Zählerstand Bezug"
			subtype="text"
			pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)|none"
			:model-value="configuration.imported_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.imported_path')
			"
		>
			<template #help>
				Diese Angabe wird an die Server-URL angehängt und muss mit einem
				Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche den aktuellen
				absoluten Zählerstand in kWh darstellt.<br />
				Wird dieses Feld leer gelassen, wird der Zählerstand intern
				simuliert.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Pfad für Zählerstand Einspeisung"
			subtype="text"
			pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)|none"
			:model-value="configuration.exported_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.exported_path')
			"
		>
			<template #help>
				Diese Angabe wird an die Server-URL angehängt und muss mit einem
				Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche den aktuellen
				absoluten Zählerstand in kWh darstellt.<br />
				Wird dieses Feld leer gelassen, wird der Zählerstand intern
				simuliert.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Pfad für Strom Phase 1"
			subtype="text"
			pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)|none"
			:model-value="configuration.current_l1_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.current_l1_path')
			"
		>
			<template #help>
				Diese Angabe wird an die Server-URL angehängt und muss mit einem
				Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Stromstärke der 1. Phase in Ampere darstellt.<br />
				Wird dieses Feld leer gelassen, werden keine Phasenströme
				ermittelt und es kann kein Lastmanagement berechnet werden!
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Pfad für Strom Phase 2"
			subtype="text"
			pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)|none"
			:model-value="configuration.current_l2_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.current_l2_path')
			"
		>
			<template #help>
				Diese Angabe wird an die Server-URL angehängt und muss mit einem
				Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Stromstärke der 2. Phase in Ampere darstellt.<br />
				Wird dieses Feld leer gelassen, werden keine Phasenströme
				ermittelt und es kann kein Lastmanagement berechnet werden!
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Pfad für Strom Phase 3"
			subtype="text"
			pattern="^(/[-a-zA-Z0-9@:%_\+.~#?&/=]*)|none"
			:model-value="configuration.current_l3_path"
			@update:model-value="
				updateConfiguration($event, 'configuration.current_l3_path')
			"
		>
			<template #help>
				Diese Angabe wird an die Server-URL angehängt und muss mit einem
				Schrägstrich "/" beginnen.<br />
				Es wird vom Server eine Zahl (Float mit Punkt als
				Dezimaltrennzeichen oder Integer) erwartet, welche die aktuelle
				Stromstärke der 3. Phase in Ampere darstellt.<br />
				Wird dieses Feld leer gelassen, werden keine Phasenströme
				ermittelt und es kann kein Lastmanagement berechnet werden!
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceHttpCounter",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
