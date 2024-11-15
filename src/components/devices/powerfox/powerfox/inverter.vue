<template>
  <div class="device-powerfox-inverter">
    <openwb-base-heading> Einstellungen für Powerfox Wechselrichter </openwb-base-heading>
    <openwb-base-text-input
      title="ID"
      required
      :model-value="component.configuration.id"
      @update:model-value="updateConfiguration($event, 'configuration.id')"
    >
      <template #help>
        Um die ID herauszufinden mit dem Browser die Adresse
        <a
          href="https://backend.powerfox.energy/api/2.0/my/all/devices"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://backend.powerfox.energy/api/2.0/my/all/devices
        </a>
        aufrufen und dort Benutzername und Passwort eingeben. Die DeviceID ist exakt so einzutragen, wie in der Antwort
        des Servers. Das bedeutet insbesondere auch, die Groß-/Kleinschreibung ist zu beachten! In dem Feld ist nur die
        Zeichenfolge direkt hinter
        <span
          class="font-weight-bold text-monospace"
          style="display: contents"
        >
          "DeviceID"
        </span>
        ohne den Doppelpunkt und Anführungszeichen einzutragen.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DevicePowerfoxInverter",
  mixins: [ComponentConfigMixin],
};
</script>
