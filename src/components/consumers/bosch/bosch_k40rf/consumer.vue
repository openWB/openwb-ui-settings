<template>
  <div class="consumer-bosch-k40rf">
    <openwb-base-heading>Einstellungen für Wärmepumpe (K 40 RF Gateway)</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Für Bosch, Buderus, IVT, Vulcano und Worcester Wärmepumpen/Hybridgeräte mit K 40 RF Gateway (bei Buderus als MX400
      bezeichnet). Nur Leistungs- und Energiewerte, keine Steuerung möglich - die API ist nur lesend. Zugangstoken
      einmalig per WLAN- und Wireless-Taste am Gateway und einem curl-Aufruf gegen Port 9442 erzeugen (siehe
      Bosch-Dokumentation), dann hier eintragen.
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
      :placeholder="9443"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-text-input
      title="Zugangstoken"
      subtype="password"
      required
      :model-value="consumer.configuration.token"
      @update:model-value="updateConfiguration($event, 'configuration.token')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerBoschK40Rf",
  mixins: [ConsumerConfigMixin],
};
</script>
