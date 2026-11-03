<template>
  <openwb-base-alert subtype="info">
    <p>
      Der openWB Lastmanager koordiniert die verfügbare Leistung in größeren Installationen mit mehreren Häusern,
      beispielsweise in Wohnquartieren. Diese Aktion berücksichtigt die vom übergeordneten Lastmanager vorgegebenen
      Leistungs- und Stromgrenzen in der lokalen Regelung.
    </p>
    <p>Über dieses MQTT-Topic werden die Vorgaben des Lastmanagers übermittelt.</p>
    <ol>
      <li>
        <openwb-base-copy-to-clipboard
          class="text-info"
          tooltip="Topic kopieren"
        >
          openWB/set/mqtt/loadmanager/{{ ioAction.id }}/set/loadmanager
        </openwb-base-copy-to-clipboard>
        <br />
        Das Topic erwartet ein JSON-Objekt mit der verfügbaren Leistung "max_power" in Watt, den verfügbaren
        Phasenströmen "max_current" in Ampere und dem Unix-Zeitstempel "timestamp" in Sekunden.
        <br />
        Beispiel:
        <span class="text-info">
          { "max_power": 10000, "max_current": [6, 6, 6], "timestamp": 1783596593.635847 }
        </span>
      </li>
    </ol>
  </openwb-base-alert>
  <openwb-base-number-input
    title="maximale Bezugsleistung im Fehlerfall"
    unit="kW"
    min="0"
    step="0.01"
    required
    :model-value="(ioAction.configuration.max_power_on_failure || 0) / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_power_on_failure')"
  />
  <openwb-base-number-input
    title="maximaler Strom im Fehlerfall"
    unit="A"
    min="0"
    step="0.01"
    required
    :model-value="(ioAction.configuration.max_current_on_failure || 0) / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_current_on_failure')"
  />
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";

export default {
  name: "IoActionLoadManager",
  mixins: [OpenwbIoActionConfigMixin],
};
</script>
