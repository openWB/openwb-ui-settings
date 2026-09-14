<template>
  <div class="consumer-shelly-em">
    <openwb-base-heading> Einstellungen für Shelly EM (Messen) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Unterstützt werden theoretisch alle ein- und dreiphasigen Shelly der Generation 1-3. Getestete Modelle sind Shelly
      1pm, 1pm plus, Pro, Pro 3EM, Plug S.
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
        Nur auszufüllen, wenn im Shelly die Authentifizierung aktiviert wurde. Funktioniert nicht für Shelly
        Plus.</template
      >
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      :model-value="consumer.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Nur auszufüllen, wenn im Shelly die Authentifizierung aktiviert wurde. Funktioniert nicht für Shelly
        Plus.</template
      >
    </openwb-base-text-input>
    <openwb-base-select-input
      title="Vorzeichen invertieren"
      not-selected="Bitte auswählen"
      :options="[
        { value: -1, text: 'ja' },
        { value: 1, text: 'nein' },
      ]"
      :model-value="consumer.configuration.factor"
      required
      @update:model-value="updateConfiguration($event, 'configuration.factor')"
    >
      <template #help>
        Einige Shelly Modelle liefern die Leistung mit umgedrehtem Vorzeichen. Falls dies der Fall sein sollte, das
        Vorzeichen invertieren.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerShellyEm",
  mixins: [ConsumerConfigMixin],
};
</script>
