<template>
  <div class="consumer-shelly-pm">
    <openwb-base-heading> Einstellungen für Shelly PM (Messen & Schalten) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Unterstützt werden theoretisch alle ein- und dreiphasigen Shelly der Generation 1-3. Getestete Modelle sind Shelly
      1pm, 1pm plus, Pro Pro 3EM, Plug S.
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
      required
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
      required
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
    <openwb-base-number-input
      title="Phase 1 des Verbraucheranschlusses"
      required
      :min="1"
      :max="3"
      :model-value="consumer.configuration.phase"
      @update:model-value="updateConfiguration($event, 'configuration.phase')"
    >
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Faktor"
      required
      step="any"
      :model-value="consumer.configuration.factor"
      @update:model-value="updateConfiguration($event, 'configuration.factor')"
    >
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerShellyPm",
  mixins: [ConsumerConfigMixin],
};
</script>
