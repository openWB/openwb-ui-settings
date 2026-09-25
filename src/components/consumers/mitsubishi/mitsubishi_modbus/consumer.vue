<template>
  <div class="consumer-mitsubishi-modbus">
    <openwb-base-heading>
      Einstellungen für Mitsubishi Electric Klimaanlage (Intesis Modbus-Interface)
    </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Benötigt das separat erhältliche Intesis/HMS-Modbus-Interface (INMBSMIT001I000), das an den CN105-Anschluss der
      Inneneinheit angeschlossen wird. Kompatibel mit Domestic-, Mr.-Slim- und City-Multi-Baureihen. Nur Ein/Aus, keine
      Leistungsmessung - wer den Verbrauch erfassen will, braucht eine separate Leistungsmessung (zB
      Zwischenzähler/Smart-Plug).
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
      :min="1"
      :max="63"
      :model-value="consumer.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help> Werkseinstellung des Interfaces: 1 (über DIP-Schalter SW3 einstellbar). </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerMitsubishiModbus",
  mixins: [ConsumerConfigMixin],
};
</script>
