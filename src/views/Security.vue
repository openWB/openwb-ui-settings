<template>
  <div class="security">
    <form name="optionalComponentsForm">
      <openwb-base-card title="Allgemein">
        <openwb-base-button-group-input
          title="Unverschlüsselten Zugang erlauben"
          :model-value="$store.state.mqtt['openWB/general/allow_unencrypted_access']"
          :disabled="$store.state.mqtt['openWB/general/user_management_active'] === true ? true : false"
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
              Zugriff über MQTT (Ports 1883 und 9001) als auch über HTTP (Port 80) (Weboberfläche).
            </p>
            <p>
              <strong>Hinweis:</strong> Aus Sicherheitsgründen sollte der unverschlüsselte Zugang nur in geschützten
              Netzwerken aktiviert werden. Für die integrierten Benutzerverwaltung muss der unverschlüsselte Zugang
              zuerst deaktiviert werden.
            </p>
          </template>
        </openwb-base-button-group-input>
        <openwb-base-button-group-input
          title="Benutzerverwaltung"
          :model-value="$store.state.mqtt['openWB/general/user_management_active']"
          :disabled="$store.state.mqtt['openWB/general/allow_unencrypted_access'] === true ? true : false"
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
          @update:model-value="updateState('openWB/general/user_management_active', $event)"
        >
          <template #help>
            <p>
              Hier kann die integrierte Benutzerverwaltung von openWB aktiviert oder deaktiviert werden. Mit aktivierter
              Benutzerverwaltung ist der Zugriff auf den Mosquitto Broker (MQTT) und davon abhängige Dienste
              (Weboberfläche, API) nur mit einem gültigen Benutzerkonto möglich.
            </p>
            <p>
              <strong>Hinweis:</strong> Die Benutzerverwaltung erfordert zwingend die Abschaltung des unverschlüsselten
              Zugangs.
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
  name: "OpenwbSecurityView",
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
      mqttTopicsToSubscribe: ["openWB/general/allow_unencrypted_access", "openWB/general/user_management_active"],
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
