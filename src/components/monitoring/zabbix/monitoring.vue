<template>
  <div class="monitoring-zabbix">
    <openwb-base-alert subtype="info">
      Mit dem Monitoring-Service von openWB kannst Du Dein System ganz einfach überwachen. Einfach
      <a
        href="https://openwb.de/dummy"
        target="_blank"
        rel="noopener noreferrer"
      >
        hier
      </a>
      anmelden und Deine Zugangsdaten erhalten.<br />Alternativ kannst Du auch deinen eigenen Zabbix-Server aufsetzen
      und die Zugangsdaten hier eintragen.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Zielhost"
      subtype="host"
      required
      :model-value="monitoring.configuration.destination_host"
      @update:model-value="updateConfiguration($event, 'configuration.destination_host')"
    />
    <openwb-base-text-input
      title="Eigener Hostname"
      subtype="user"
      required
      :model-value="monitoring.configuration.hostname"
      @update:model-value="updateConfiguration($event, 'configuration.hostname')"
    />
    <openwb-base-text-input
      title="PSK Identifier"
      subtype="text"
      required
      :model-value="monitoring.configuration.psk_identifier"
      @update:model-value="updateConfiguration($event, 'configuration.psk_identifier')"
    />
    <openwb-base-text-input
      title="PSK Key"
      subtype="password"
      required
      :model-value="monitoring.configuration.psk_key"
      @update:model-value="updateConfiguration($event, 'configuration.psk_key')"
    />
  </div>
</template>

<script>
import MonitoringConfigMixin from "../MonitoringConfigMixin.vue";

export default {
  name: "MonitoringZabbix",
  mixins: [MonitoringConfigMixin],
};
</script>
