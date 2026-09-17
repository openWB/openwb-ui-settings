<template>
  <div class="consumer-luxtronik">
    <openwb-base-heading> Einstellungen für Luxtronik 2.1 </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Für Wärmepumpen mit Luxtronik-2.1-Regelung. Diese Regelung wird von mehreren Marken baugleich verwendet, zB alpha
      innotec, Novelan, Roth (ThermoAura/ThermoTerra), Buderus (Logamatic HMC 20), Nibe (AP-AW10), Wolf (BWL/BWS) und
      CTA (Aeroplus). ModbusTCP muss in der Regelung aktiviert sein (SERVICE &gt; Systemsteuerung &gt; Konnektivität
      &gt; Smart-Home-Interface).
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
      :max="255"
      :model-value="consumer.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-number-input
      title="Anhebung Solltemperatur"
      required
      :min="0"
      :step="0.5"
      :model-value="consumer.configuration.boost_offset"
      @update:model-value="updateConfiguration($event, 'configuration.boost_offset')"
    >
      <template #help>
        Anhebung von Heiz- und Warmwassersolltemperatur im Überschussbetrieb in Kelvin. Abhängig vom Heizsystem
        (Fußbodenheizung/Heizkörper, Puffergröße) anzupassen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerLuxtronik",
  mixins: [ConsumerConfigMixin],
};
</script>
