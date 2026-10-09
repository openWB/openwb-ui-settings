<template>
  <div class="vehicle-soc-byd">
    <openwb-base-alert subtype="warning">
      <b>Wichtig: nicht den normalen BYD-App-Account verwenden!</b><br />
      BYD erlaubt pro Account immer nur eine aktive Sitzung. Loggt sich jemand mit denselben Zugangsdaten in der BYD-App
      ein, wird die Verbindung von openWB getrennt (und umgekehrt). Stattdessen:
      <ol class="mb-0">
        <li>
          Einen <b>zweiten, separaten BYD-Account</b> anlegen (z.B. mit einer beliebigen zusätzlichen E-Mail-Adresse,
          wie <code>deinname+byd@gmail.com</code>) und einmalig in der BYD-App einrichten.
        </li>
        <li>Danach in der App wieder mit dem Hauptaccount einloggen.</li>
        <li>
          Über die Freigabe-/Familienfunktion der BYD-App das Fahrzeug für den zweiten Account freigeben (Einladung
          annehmen).
        </li>
        <li>
          Den zweiten Account <b>nie wieder in der BYD-App</b> einloggen - nur dessen Zugangsdaten hier in openWB
          eintragen, damit die Sitzung ausschließlich openWB gehört.
        </li>
      </ol>
    </openwb-base-alert>
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    >
      <template #help> E-Mail-Adresse des zweiten BYD-Accounts (siehe Hinweis oben). </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Falsche Zugangsdaten verbrauchen einen von wenigen Login-Versuchen, bevor der Account von BYD gesperrt wird -
        openWB pausiert nach einem Fehlversuch daher automatisch für eine Stunde, bevor erneut versucht wird.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Nur nötig, falls mehrere Fahrzeuge am Account hängen - sonst wird automatisch das einzige Fahrzeug verwendet.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Land"
      required
      :model-value="vehicle.configuration.country_code"
      @update:model-value="updateConfiguration($event, 'configuration.country_code')"
    >
      <template #help>
        ISO-Ländercode wie in der BYD-App unter "Land/Region" hinterlegt, z.B. "DE" oder "NL".
      </template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      title="Antriebsart"
      :buttons="[
        { buttonValue: 'ev', text: 'Elektro (BEV)', class: 'btn-outline-success' },
        { buttonValue: 'hybrid', text: 'Plug-in-Hybrid', class: 'btn-outline-primary' },
      ]"
      :model-value="vehicle.configuration.energy_type"
      @update:model-value="updateConfiguration($event, 'configuration.energy_type')"
    >
      <template #help>
        Bei falscher Einstellung liefert die BYD-API bei Plug-in-Hybriden die EV-Reichweite und Verbrauchswerte als 0
        zurück.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocByd",
  mixins: [VehicleConfigMixin],
};
</script>
