<template>
	<div class="backup-cloud-onedrive">
		<openwb-base-heading>
			Einstellungen für Onedrive Backup
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Zum Abruf der Zugangsberechtigung bitte die Konfiguration speichern,
			dann die Schritte 1-4 durchführen und danach die Konfiguration erneut speichern. <br>
			Auth Code und URL werden nur einmal benötigt werden nach erfolgreicher Authorisierung wieder gelöscht.			
		</openwb-base-alert>
		<openwb-base-text-input
			title="Backupverzeichnis in Onedrive"
			subtype="text"
			required
			pattern="^/(.*/)*"
			:model-value="configuration.backuppath"
			@update:model-value="
				updateConfiguration($event, 'configuration.backuppath')
			"
		>
			<template #help>
				In diesem Verzeichnis werden die Backudateien erstellt. Bitte
				den Pfad mit / beenden. <br/>Beispiel: /openWB/Backup/
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
						title="Anmeldedaten auf openWB gespeichert"
						readonly
						:model-value="configuration.persistent_tokencache ? 'Ja' : 'Nein'"
					>
		</openwb-base-text-input>
		<openwb-base-heading>Zugang zu Onedrive für diese openWB authorisieren</openwb-base-heading>
		<openwb-base-button-input
						title="1. Anmeldeanforderung erstellen"
						buttonText="Authorisierungscode anfordern"
						subtype="success"
						@buttonClicked="
										sendSystemCommand('requestMSALAuthCode', {})
									"
					>
					<template #help>
					Es werden Zugangstokens für Onedrive angefordert. Diese werden nur lokal auf dieser openWB gespeichert.
					Genutzt wird Device Flow mit public application. <br>
					https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-device-code <br>
					https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-client-applications
					</template>	
				</openwb-base-button-input>
		<openwb-base-text-input
			title="2. Diesen Code kopieren"
			subtype="text"
			readonly
			:model-value="configuration.authcode"
		>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="3. Anmelde-URL aufrufen"
			subtype="url"
			readonly
			:model-value="configuration.authurl"
		>
			<template #help>
				Diese URL im Browser öffnen und den Code eingeben. Dies erzeugt die notwendigen Zugangsberechtigung für diese openWB.
			</template>
		</openwb-base-text-input>
		<openwb-base-button-input
						title="4. Token abrufen und speichern"
						buttonText="Authorisierungstokens abrufen"
						subtype="success"
						@buttonClicked="
										sendSystemCommand('retrieveMSALTokens', {})
									"
					>
						<template #help>
							Zugangstoken wird abgerufen und gespeichert, damit das Backup durchgeführt werden kann.
							Zugangstoken werden nur lokal auf dieser openWB gespeichert.
						</template>
		</openwb-base-button-input>

	</div>
</template>

<script>
export default {
	name: "BackupCloudOneDrive",
	emits: ["update:configuration", "sendCommand"],
	props: {
		configuration: { type: Object, required: true },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
		sendSystemCommand(command, data = {}) {
			this.$emit("sendCommand", {
				command: command,
				data: data,
			});
		},
	},
};
</script>
