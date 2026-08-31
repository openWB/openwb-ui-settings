<template>
  <div class="consumer-vampair">
    <openwb-base-heading>Einstellungen für Vampair Wärmepumpe</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Im Servicemenü muss (durch eine Fachkraft) die Überstromnutzung aktiviert und auf ModbusTCP gestellt werden.
      Danach muss lediglich eine Ein- und Ausschaltschwelle für die Überstromnutzung eingestellt werden. Für die
      Verwendung "Wärmepumpe in Eigensteuerung" muss dann die Ein- und Ausschaltschwelle für die Überstromnutzung
      eingestellt werden. Eine negative Ausschaltschwelle bedeutet, dass die Wärmepumpe die fehlende Leistung aus dem
      Netz bezieht. Für die Verwendung "Stufenlos regelbar" sollte die Ein- und Ausschaltschwelle auf die maximale
      Leistung der Wärmepumpe gestellt werden. openWB gibt dann der Wärmepumpe die Leistung vor.
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
  name: "ConsumerVampair",
  mixins: [ConsumerConfigMixin],
};
</script>
