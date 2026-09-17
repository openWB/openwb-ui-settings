<template>
  <div class="consumer-gree">
    <openwb-base-heading> Einstellungen für Gree Klimaanlage </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Nutzt das lokale WLAN-Protokoll der Gree-Klimaanlage, die Kopplung mit dem Gerät erfolgt automatisch bei der
      ersten Verbindung. Nur Ein/Aus, keine Leistungsmessung - wer den Verbrauch erfassen will, braucht eine separate
      Leistungsmessung (zB Zwischenzähler/Smart-Plug).
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    >
      <template #help> Standardport der Gree-Klimaanlage: 7000. </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerGree",
  mixins: [ConsumerConfigMixin],
};
</script>
