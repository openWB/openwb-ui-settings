<template>
  <div class="network">
    <form name="optionalComponentsForm">
      <openwb-base-card title="Allgemein">
        <openwb-base-button-group-input
          title="Unverschlüsselten Zugang erlauben"
          :model-value="$store.state.mqtt['openWB/general/allow_unencrypted_access']"
          :buttons="[
            {
              buttonValue: false,
              text: 'Aus',
              class: 'btn-outline-danger',
            },
            {
              buttonValue: true,
              text: 'An',
              class: 'btn-outline-success',
            },
          ]"
          @update:model-value="updateState('openWB/general/allow_unencrypted_access', $event)"
        >
          <template #help>
            <p>
              Hier kann eingestellt werden, ob unverschlüsselter Zugang zu openWB erlaubt ist. Dies betrifft sowohl den
              Zugriff über MQTT (Port 1883) als auch über HTTP (Port 80) (Weboberfläche).
            </p>
            <p>
              <strong>Hinweis:</strong> Aus Sicherheitsgründen sollte der unverschlüsselte Zugang nur in geschützten
              Netzwerken aktiviert werden. In Verbindung mit der integrierten Benutzerverwaltung wird dringend davon
              abgeraten, den unverschlüsselten Zugang zu erlauben.
            </p>
          </template>
        </openwb-base-button-group-input>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="optionalComponentsForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbNetworkView",
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  // "save" and "reset" are already defined in ComponentState but check is failing if not defined here?
  emits: ["save", "reset", "defaults", "sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/general/allow_unencrypted_access"],
    };
  },
  methods: {
    sendSystemCommand(command, data = {}) {
      this.$emit("sendCommand", {
        command: command,
        data: data,
      });
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
