<template>
  <div class="dataProtection">
    <form name="dataProtectionForm">
      <openwb-base-card title="Nutzungsbedingungen &amp; Datenschutzerklärung">
        <iframe
          src="dataProtection-usageTerms.html"
          width="100%"
          height="400px"
          class="bg-light"
        />
        <hr />
        <openwb-base-button-group-input
          title="Nutzungsbedingungen"
          :buttons="[
            {
              buttonValue: false,
              text: 'Ablehnen',
              class: 'btn-outline-danger',
            },
            {
              buttonValue: true,
              text: 'Akzeptieren',
              class: 'btn-outline-success',
            },
          ]"
          :model-value="$store.state.mqtt['openWB/system/usage_terms_acknowledged']"
          @update:model-value="updateState('openWB/system/usage_terms_acknowledged', $event)"
        />
        <openwb-base-alert
          v-if="!$store.state.mqtt['openWB/system/usage_terms_acknowledged']"
          subtype="danger"
          class="mb-1"
        >
          Sie müssen die Nutzungsbedingungen akzeptieren, bevor openWB eingesetzt werden kann.
          <div class="row justify-content-center">
            <div class="col-md-4 d-flex justify-content-center">
              <openwb-base-click-button
                class="btn-danger"
                @button-clicked="sendSystemCommand('systemShutdown')"
              >
                Nicht akzeptieren und ausschalten
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'power-off']"
                />
              </openwb-base-click-button>
            </div>
          </div>
        </openwb-base-alert>
        <openwb-base-button-group-input
          title="Datenschutzerklärung"
          :buttons="[
            {
              buttonValue: false,
              text: 'Ablehnen',
              class: 'btn-outline-danger',
            },
            {
              buttonValue: true,
              text: 'Akzeptieren',
              class: 'btn-outline-success',
            },
          ]"
          :model-value="$store.state.mqtt['openWB/system/dataprotection_acknowledged']"
          @update:model-value="updateState('openWB/system/dataprotection_acknowledged', $event)"
        />
        <openwb-base-alert
          v-if="!$store.state.mqtt['openWB/system/dataprotection_acknowledged']"
          subtype="warning"
        >
          Wenn Du nicht einwilligst, wird eine ggf. konfigurierte Cloud-Anbindung gelöscht. Die openWB arbeitet autark
          wie gewohnt weiter. Fernzugriff und Remote-Support sind dann nicht mehr möglich!
        </openwb-base-alert>
        <template #footer>
          <openwb-base-submit-buttons
            form-name="dataProtectionForm"
            :hide-reset="true"
            :hide-defaults="true"
            @save="$emit('save')"
          />
        </template>
      </openwb-base-card>
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPowerOff as fasPowerOff } from "@fortawesome/free-solid-svg-icons";
library.add(fasPowerOff);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbDataProtectionView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  emits: ["sendCommand", "save"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/system/dataprotection_acknowledged",
        // "openWB/system/usage_terms_acknowledged", // already done in app.vue
      ],
    };
  },
  methods: {
    sendSystemCommand(command, data = {}) {
      this.$emit("sendCommand", {
        command: command,
        data: data,
      });
    },
  },
};
</script>
