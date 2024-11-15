<template>
  <div class="varta-inverter">
    <openwb-base-alert subtype="info">
      Die Leistung des Wechselrichters ist nur verfügbar, wenn dieser über Sensor an Varta angebunden ist.
      Wechselrichter die per Modbus mit dem Speicher kommunizieren lassen sich nicht über den Varta PV-Sensor auslesen.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceVartaInverter",
  mixins: [ComponentConfigMixin],
};
</script>
