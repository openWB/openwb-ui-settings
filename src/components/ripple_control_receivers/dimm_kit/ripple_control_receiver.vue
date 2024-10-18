<template>
  <div class="ripple-control-receiver-dimm-kit">
    <openwb-base-alert subtype="info">
      In der aktuellen Implementierung werden Kontakt 1 und 2 des
      Dimm-Kits ausgewertet. Wenn mindestens ein Kontakt die Bedingung
      für die Ladefreigabe nicht erfüllt, wird
      die Ladung gesperrt. Wenn beide Kontakte die Bedingung erfüllen, 
      darf geladen werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="rippleControlReceiver.configuration.ip_address"
      @update:model-value="
        updateConfiguration($event, 'configuration.ip_address')
      "
    />
    <openwb-base-number-input
      title="Port"
      required
      :model-value="rippleControlReceiver.configuration.port"
      @update:model-value="
        updateConfiguration($event, 'configuration.port')
      "
    />
    <openwb-base-number-input
      title="Modbus-ID"
      required
      :min="1"
      :max="255"
      :model-value="rippleControlReceiver.configuration.modbus_id"
      @update:model-value="
        updateConfiguration($event, 'configuration.modbus_id')
      "
    />
    <openwb-base-button-group-input
      title="Ladefreigabe, wenn Kontakte"
      :model-value="rippleControlReceiver.configuration.sw_ok"
      :buttons="[
        { buttonValue: 'CLOSED', text: 'geschlossen' },
        { buttonValue: 'OPENED', text: 'offen' },
      ]"
      @update:model-value="
        updateConfiguration($event, 'configuration.sw_ok')
      "
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
