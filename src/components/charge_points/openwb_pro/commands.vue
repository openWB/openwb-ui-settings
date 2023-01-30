<template>
	<div class="charge-point-commands-openwbpro">
		<openwb-base-heading>
			Befehle für Ladepunkt OpenWB Pro
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-button-input
			title="Ladepunkt aktualisieren"
			buttonText="Update anfordern"
			subtype="success"
			:disabled="configuration.ip_address == undefined"
			@buttonClicked="triggerUpdate"
		>
			<template #help>
				Mit diesem Befehl können Sie die Aktualisierung der openWB Pro
				anstoßen. Bitte beachten Sie, dass kein Fahrzeug angesteckt ist.
			</template>
		</openwb-base-button-input>
	</div>
</template>

<script>
export default {
	name: "ChargePointCommandsOpenwbPro",
	props: {
		configuration: { type: Object, required: true },
		chargePointId: { default: undefined },
	},
	methods: {
		async triggerUpdate() {
			let formData = new FormData();
			formData.append("update", 1);
			const startedMessage =
				"Die Aktualisierung der openWB Pro wird gestartet...";
			const timestamp = Math.floor(Date.now() / 1000);
			this.$store.commit("addTopic", {
				topic:
					"openWB/command/" +
					this.$root.mqttClientId +
					"/messages/" +
					timestamp,
				payload: {
					source: "command",
					type: "info",
					message: startedMessage,
					timestamp: timestamp,
				},
			});
			this.axios
				.post(
					"http://" + this.configuration.ip_address + "/connect.php",
					formData,
					{ timeout: 5000 }
				)
				.then((response) => {
					console.log("POST response", response.data);
					const successMessage =
						"Die Aktualisierung der openWB Pro wurde erfolgreich gestartet.";
					const timestamp = Math.floor(Date.now() / 1000);
					this.$store.commit("addTopic", {
						topic:
							"openWB/command/" +
							this.$root.mqttClientId +
							"/messages/" +
							timestamp,
						payload: {
							source: "command",
							type: "success",
							message: successMessage,
							timestamp: timestamp,
						},
					});
				})
				.catch((error) => {
					var alertMessage = "Aktualisierung fehlgeschlagen!<br />";
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						console.log(error.response.status, error.response.data);
						alertMessage +=
							error.response.status + ": " + error.response.data;
					} else if (error.request) {
						// The request was made but no response was received
						// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						// http.ClientRequest in node.js
						console.log(error.request);
						alertMessage +=
							"Es wurde keine Antwort vom Server empfangen.";
					} else {
						// Something happened in setting up the request that triggered an Error
						console.log("Error", error.message);
						alertMessage +=
							"Es ist ein unbekannter Fehler aufgetreten.";
					}
					const timestamp = Math.floor(Date.now() / 1000);
					this.$store.commit("addTopic", {
						topic:
							"openWB/command/" +
							this.$root.mqttClientId +
							"/messages/" +
							timestamp,
						payload: {
							source: "command",
							type: "danger",
							message: alertMessage,
							timestamp: timestamp,
						},
					});
				});
		},
	},
};
</script>
