<template>
  <div class="consumer-esphome">
    <openwb-base-heading>Einstellungen für ESPHome</openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Name des Leistungs-Sensors"
      subtype="text"
      required
      :model-value="consumer.configuration.power_sensor_name"
      @update:model-value="updateConfiguration($event, 'configuration.power_sensor_name')"
    >
      <template #help>
        Genau der Name ("name:"), der dem Sensor in der ESPHome-YAML-Konfiguration des Geräts gegeben wurde - nicht die
        interne "id:". Beispiel:
        <pre class="mb-1">
sensor:
  - platform: ...
    name: "Dehumidifier Power"</pre>
        Hier dann genau <code>Dehumidifier Power</code> eintragen (inkl. Groß-/Kleinschreibung und Leerzeichen). Der
        Name lässt sich auch in der Weboberfläche des Geräts ablesen, falls "web_server:" in der YAML aktiviert ist.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Name des Schalters"
      subtype="text"
      :model-value="consumer.configuration.switch_name"
      @update:model-value="updateConfiguration($event, 'configuration.switch_name')"
    >
      <template #help>
        Optional: Name des Schalters ("name:" in der YAML, analog zum Leistungs-Sensor oben), über den der Verbraucher
        ein- und ausgeschaltet werden kann, z. B.:
        <pre class="mb-1">
switch:
  - platform: gpio
    name: "Dehumidifier"</pre>
        Ohne Angabe werden nur Messwerte erfasst.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerEsphome",
  mixins: [ConsumerConfigMixin],
};
</script>
