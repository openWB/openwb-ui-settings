<template>
	<div class="vehicle-soc-tesla">
		<openwb-base-heading>
			Einstellungen für manuellen SoC
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Beim Anstecken des Fahrzeugs muss der aktuelle SoC (am Display oder
			über einen Browser) angegeben werden. Anhand des Zählers im
			Ladepunkt wird dann der aktuelle SoC errechnet. Ausschlaggebend für
			die Qualität dieses Moduls sind die beiden Einstellungen "Kapazität
			der Batterie" in der Fahrzeug-Vorlage und "Wirkungsgrad".
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
/**
 * Credits to:
 * https://raw.githubusercontent.com/teslascope/tokens/master/auth.tokens.py
 * https://github.com/timdorr/tesla-api/discussions/288
 * https://github.com/timdorr/tesla-api/discussions/296
 * https://github.com/timdorr/tesla-api/discussions/362
 */
import { encode } from "urlsafe-base64";
import crypto from "crypto";
import url from "url";
import axios from "axios";
// import { Buffer } from "buffer";

import ComponentStateVue from "../../mixins/ComponentState.vue";

export default {
	name: "VehicleSocTesla",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		vehicleId: { required: true },
	},
	data() {
		return {
			tesla_api_oauth2: "https://auth.tesla.com/oauth2/v3",
			tesla_api_redirect: "https://auth.tesla.com/void/callback",
			tesla_api_owners: "https://owner-api.teslamotors.com/oauth/token",
			user_agent:
				"Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) " +
				"AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
			code_challenge: null,
			code_verifier: null,
			page_not_found_url: "",
		};
	},
	mixins: [ComponentStateVue],
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
		// tesla specific methods
		tesla_login_window() {
			this.tesla_gen_challenge();
			var teslaLogin = window.open(
				this.tesla_gen_url(),
				"TeslaLogin",
				"width=800,height=600,status=yes,scrollbars=yes,resizable=yes"
			);
			teslaLogin.focus();
		},
		tesla_gen_challenge() {
			this.code_verifier = encode(crypto.randomBytes(86))
				.replace(/[^a-zA-Z0-9]/gi, "")
				.substring(0, 86);
			const hash = crypto
				.createHash("sha256")
				.update(this.code_verifier)
				.digest();
			this.code_challenge = encode(hash);
			console.log(
				this.code_verifier,
				this.code_verifier.length,
				this.code_challenge,
				this.code_challenge.length
			);
		},
		tesla_gen_url() {
			const teslaAuthUrl = new URL(this.tesla_api_oauth2 + "/authorize/");
			teslaAuthUrl.searchParams.append("client_id", "ownerapi");
			teslaAuthUrl.searchParams.append(
				"code_challenge",
				this.code_challenge
			);
			teslaAuthUrl.searchParams.append("code_challenge_method", "S256");
			teslaAuthUrl.searchParams.append(
				"redirect_uri",
				this.tesla_api_redirect
			);
			teslaAuthUrl.searchParams.append("response_type", "code");
			teslaAuthUrl.searchParams.append(
				"scope",
				"openid email offline_access"
			);
			teslaAuthUrl.searchParams.append("state", "myteslaapp");
			return teslaAuthUrl;
		},
		async tesla_login() {
			const queryObject = url.parse(this.page_not_found_url, true).query;
			console.debug("queryObject", queryObject);
			if (!queryObject.code) {
				console.error(
					"Something is wrong... Code does not exist in URL"
				);
				this.$root.postClientMessage(
					"Die eingegebene URL ist ungültig.",
					"danger"
				);
				return;
			}
			const data = {
				url: this.tesla_api_owners,
				user_agent: this.user_agent,
				data: {
					grant_type: "authorization_code",
					client_id: "ownerapi",
					code: queryObject.code,
					code_verifier: this.code_verifier,
					redirect_uri: this.tesla_api_redirect,
				},
			};
			try {
				const response = await axios.post(
					location.protocol +
						"//" +
						location.host +
						"/openWB/web/settings/modules/vehicles/tesla/tesla.php",
					JSON.parse(JSON.stringify(data)),
					{
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					}
				);
				console.debug("response", response);
				this.updateConfiguration(
					{
						access_token: response.data.access_token,
						refresh_token: response.data.refresh_token,
						created_at: response.data.created_at,
						expires_in: response.data.expires_in,
					},
					"configuration.token"
				);
				this.$root.postClientMessage(
					"Token erfolgreich abgerufen.",
					"success"
				);
			} catch (error) {
				console.error(error);
				this.$root.postClientMessage(
					"Beim Abruf der Token ist ein Fehler aufgetreten!<pre>" +
						error +
						"</pre>",
					"danger"
				);
			}
		},
	},
};
</script>
