<template>
  <div class="consumer-openwb-wallbox-socket">
    <openwb-base-heading>Einstellungen für die Wallbox-Steckdose</openwb-base-heading>
    <openwb-base-select-input
      title="Wallbox-Steckdose"
      not-selected="Bitte Ladepunkt auswählen"
      required
      :options="wallboxSocketOptions"
      :model-value="consumer.configuration.chargepoint_id ?? undefined"
      @update:model-value="updateConfiguration($event, 'configuration.chargepoint_id')"
    >
      <template #help>
        Den Ladepunkt der openWB auswählen, an der sich die Wallbox-Steckdose befindet. Die IP-Adresse wird aus dessen
        Konfiguration übernommen. Die Wallbox-Steckdose muss nur auf der Primary konfiguriert werden. In der Secondary
        wird diese automatisch erkannt.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerOpenwbWallboxSocket",
  mixins: [ConsumerConfigMixin],
  computed: {
    wallboxSocketOptions() {
      const options = [];
      Object.entries(this.$store.state.mqtt).forEach(([topic, chargepoint]) => {
        const match = topic.match(/^openWB\/chargepoint\/(\d+)\/config$/);
        if (
          match &&
          (chargepoint?.type === "external_openwb" ||
            (chargepoint?.type === "internal_openwb" && chargepoint.configuration?.mode === "series"))
        ) {
          const id = Number(match[1]);
          options.push({ value: id, text: chargepoint.name ?? `Ladepunkt ${id}` });
        }
      });
      return options;
    },
  },
};
</script>
