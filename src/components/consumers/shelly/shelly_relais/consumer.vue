<template>
  <div class="consumer-shelly-relais">
    <openwb-base-heading> Einstellungen für Shelly PM (Messen & Schalten) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Unterstützt werden theoretisch alle Shelly Relais bis Generation 4. Getestete Modelle sind Shelly 1 Gen4. Laut
      Doku kompatibel sind (Gen2 - Gen4) Shelly 1, 1L, 1 PM, 2 2L, 2PM, 1 Mini, 1 PM Mini, Plug S, Plug M, Plus 1, Plus
      1 Mini, Plus 1 PM.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      :model-value="consumer.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    >
      <template #help>
        Nur auszufüllen, wenn im Shelly die Authentifizierung aktiviert wurde. Funktioniert nicht für Shelly Plus.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      :model-value="consumer.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Nur auszufüllen, wenn im Shelly die Authentifizierung aktiviert wurde. Funktioniert nicht für Shelly Plus.
      </template>
    </openwb-base-text-input>
    <openwb-base-number-input
      title="Channel"
      required
      :max="3"
      :model-value="consumer.configuration.channel"
      @update:model-value="updateConfiguration($event, 'configuration.channel')"
    >
      <template #help> Gibt den Schaltkanal des Shelly an (z. B. 0 oder 1, abhängig vom Modell). </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerShellyRelais",
  mixins: [ConsumerConfigMixin],
};
</script>
