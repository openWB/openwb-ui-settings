<template>
  <div class="vehicle-soc-bmwbc">
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Der Benutzername für die Anmeldung an den BMW-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung an den BMW-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      required
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help> Die Fahrgestellnummer des Fahrzeugs. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Captcha-Token"
      required
      :model-value="vehicle.configuration.captcha_token"
      @update:model-value="updateConfiguration($event, 'configuration.captcha_token')"
    >
      <template #help>
        Zum erstmaligen Login z.B. nach einem Neustart ist ein <b>aktuelles Captcha-Token</b> notwendig.<br />
        Dazu bitte folgende Schritte durchführen:
        <ol>
          <li>
            In einem neuen Browser-Tab auf diese Seite gehen:<br />
            <a
              href="https://bimmer-connected.readthedocs.io/en/latest/captcha/rest_of_world.html"
              target="_blank"
            >
              Captcha Lösen
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'external-link-alt']"
              />
            </a>
            (https://bimmer-connected.readthedocs.io/en/latest/captcha/rest_of_world.html)
          </li>
          <li>
            Dort falls angefragt das Captcha lösen und/oder "Ich bin ein Mensch" und dann Submit anklicken. Als Ergebnis
            wird ein sehr langer String angezeigt.
          </li>
          <li>Diesen String komplett mit <b>Copy&Paste</b> in das Feld Captcha-Token eingeben.</li>
          <li>Die Konfiguration speichern.</li>
          <li><b>Sofort einmal im Desktop manuell (Kreispfeil) den SoC für das Fahrzeug abrufen.</b></li>
          <li><b>Fertig.</b> Ab jetzt wird bis zum nächsten Neustart das sog. Refresh-Token verwendet.</li>
        </ol>
        <b>Achtung: Das Captcha-Token kann nur einmal verwendet werden und gilt nur kurze Zeit!</b>
      </template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      title="SoC während der Ladung berechnen"
      :buttons="[
        {
          buttonValue: false,
          text: 'Nein',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'Ja',
          class: 'btn-outline-success',
        },
      ]"
      :model-value="vehicle.configuration.calculate_soc"
      @update:model-value="updateConfiguration($event, 'configuration.calculate_soc')"
    >
      <template #help>
        Berechnet den Ladestand (SoC) während der Ladung. <br />
        Die Berechnung erfolgt über die Ladeleistung und die Ladedauer.
        <br />
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocBmwBimmerConnected",
  mixins: [VehicleConfigMixin],
};
</script>
