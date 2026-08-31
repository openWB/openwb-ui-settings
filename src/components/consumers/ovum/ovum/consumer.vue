<template>
  <div class="consumer-ovum">
    <openwb-base-heading> Einstellungen für OVUM Wärmepumpe (CubeSpeicher/MPlus) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss am Regler unter "Fachmann/SYS/TCP" mit fester IP-Adresse eingerichtet sein. Bei Verwendungszweck
      "Ein/Aus schaltbar" steuert openWB SG-Ready über Modbus TCP - stelle sicher, dass SG-Ready an der Wärmepumpe nicht
      zusätzlich über physische Kontakte extern verdrahtet ist, da sich beide Wege gegenseitig überschreiben können.
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
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="consumer.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerOvum",
  mixins: [ConsumerConfigMixin],
};
</script>
