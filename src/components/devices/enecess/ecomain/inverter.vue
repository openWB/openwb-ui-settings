<template>
  <div class="device-enecess-ecomain-inverter">
    <openwb-base-heading> Einstellungen für EcoMain Wechselrichter </openwb-base-heading>
    <openwb-base-select-input
      title="Phasenanzahl"
      required
      :options="[
        { value: 1, text: 'Einphasig' },
        { value: 3, text: 'Dreiphasig' },
      ]"
      :model-value="component.configuration.phase_count"
      @update:model-value="changePhaseCount"
    />
    <openwb-base-checkbox-input
      title="Messrichtung invertieren"
      :model-value="component.configuration.invert"
      @update:model-value="updateConfiguration($event, 'configuration.invert')"
    >
      <template #help>
        Aktivieren, wenn die Stromwandler entgegen der vorgesehenen Messrichtung montiert wurden.
      </template>
    </openwb-base-checkbox-input>
    <template
      v-for="(channel, index) in component.configuration.channels"
      :key="index"
    >
      <openwb-base-heading> Kanal {{ index + 1 }} </openwb-base-heading>
      <openwb-base-select-input
        title="Phase"
        required
        :options="[
          { value: 1, text: 'L1' },
          { value: 2, text: 'L2' },
          { value: 3, text: 'L3' },
        ]"
        :model-value="channel.phase"
        @update:model-value="updateChannel(index, 'phase', $event)"
      />
      <openwb-base-select-input
        title="Quelle"
        required
        :options="[
          { value: 0, text: 'Hauptgerät' },
          { value: 1, text: 'Slave 1' },
          { value: 2, text: 'Slave 2' },
          { value: 3, text: 'Slave 3' },
        ]"
        :model-value="channel.source"
        @update:model-value="updateChannel(index, 'source', $event)"
      />
      <openwb-base-select-input
        title="Kanal"
        required
        :options="channelOptions"
        :model-value="channel.channel"
        @update:model-value="updateChannel(index, 'channel', $event)"
      />
    </template>
    <openwb-base-alert
      v-if="validationError"
      subtype="danger"
    >
      {{ validationError }}
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceEneCessEcoMainInverter",
  mixins: [ComponentConfigMixin],
  computed: {
    channelOptions() {
      return Array.from({ length: 10 }, (_, index) => {
        const value = index + 1;
        return { value, text: String(value) };
      });
    },
    validationError() {
      const configuration = this.component.configuration;
      if (![1, 3].includes(configuration.phase_count)) {
        return "Die Phasenanzahl muss 1 oder 3 sein.";
      }
      if (configuration.channels.length !== configuration.phase_count) {
        return "Die Anzahl der EcoMain-Kanäle stimmt nicht mit der Phasenanzahl überein.";
      }
      for (const channel of configuration.channels) {
        if (![1, 2, 3].includes(channel.phase)) {
          return "Die Phase muss L1, L2 oder L3 sein.";
        }
        if (![0, 1, 2, 3].includes(channel.source)) {
          return "Die Quelle muss Hauptgerät oder Slave 1 bis 3 sein.";
        }
        if (channel.channel < 1 || channel.channel > 10) {
          return "Der EcoMain-Kanal muss zwischen 1 und 10 liegen.";
        }
      }
      if (configuration.phase_count === 3 && new Set(configuration.channels.map(({ phase }) => phase)).size !== 3) {
        return "Bei dreiphasiger Messung müssen L1, L2 und L3 jeweils einmal konfiguriert sein.";
      }
      const physicalChannels = new Set(configuration.channels.map(({ source, channel }) => `${source}:${channel}`));
      if (physicalChannels.size !== configuration.channels.length) {
        return "Eine EcoMain-Quelle und ein Kanal dürfen nicht mehrfach verwendet werden.";
      }
      return "";
    },
  },
  methods: {
    updateChannel(index, key, value) {
      const channels = this.component.configuration.channels.map((item) => ({ ...item }));
      channels[index] = { ...channels[index], [key]: value };
      this.updateConfiguration(channels, "configuration.channels");
    },
    changePhaseCount(value) {
      const current = this.component.configuration.channels.map((item) => ({ ...item }));
      let channels;
      if (value === 1) {
        channels = [current[0] || { phase: 1, source: 0, channel: 1 }];
      } else {
        const first = current[0] || { phase: 1, source: 0, channel: 1 };
        const missingPhases = [1, 2, 3].filter((phase) => phase !== first.phase);
        const used = new Set([`${first.source}:${first.channel}`]);
        channels = [first];
        for (const phase of missingPhases) {
          let channel = 1;
          while (used.has(`0:${channel}`)) channel += 1;
          channels.push({ phase, source: 0, channel });
          used.add(`0:${channel}`);
        }
      }
      this.updateConfiguration(value, "configuration.phase_count");
      this.updateConfiguration(channels, "configuration.channels");
    },
  },
};
</script>
