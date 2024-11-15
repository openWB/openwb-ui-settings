<template>
  <div class="ripple-control-receiver-dimm-kit">
    <openwb-base-alert subtype="info">
      In der aktuellen Implementierung werden Kontakt 1 und 2 des Dimm-Kits ausgewertet. Wenn mindestens ein Kontakt
      offen ist, wird die Ladung gesperrt. Wenn beide Kontakte geschlossen sind, darf geladen werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="rippleControlReceiver.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :model-value="rippleControlReceiver.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus-ID"
      required
      :min="1"
      :max="255"
      :model-value="rippleControlReceiver.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import RippleControlReceiverConfigMixin from "../RippleControlReceiverConfigMixin.vue";

export default {
  name: "RippleControlReceiverDimmKit",
  mixins: [RippleControlReceiverConfigMixin],
};
</script>
