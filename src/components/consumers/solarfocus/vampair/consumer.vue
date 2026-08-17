<template>
  <div class="device-vampair">
    <openwb-base-heading>Einstellungen für Vampair Wärmepumpe</openwb-base-heading>
    <openwb-base-alert subtype="info">
       Im Servicemenü muss (durch eine Fachkraft) die Überstromnutzung aktiviert und auf ModbusTCP gestellt werden. Danach muss lediglich eine Ein- und Ausschaltschwelle für die Überstromnutzung eingestellt werden. 
       Für die Verwendung "Wärmepumpe in Eigentsteuerung" muss dann die Ein- und Ausschaltschwelle für die Überstromnutzung eingestellt werden. Eine negative Ausschaltschwelle bedeutet, dass die Wärmepumpe die fehlende Leistung aus dem Netz bezieht. 
       Für die Verwendung "Stufenlos regelbar" sollte die Ein- und Ausschaltschwelle auf die maximale Leistung der Wärmepumpe gestellt werden. Die openWB gibt dann der Wärmepumpe die Leistung vor.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerVampair",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
