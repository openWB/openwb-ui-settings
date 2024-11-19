<template>
  <div class="debugging">
    <form name="debugConfigForm">
      <openwb-base-card title="Protokollierung">
        <openwb-base-button-group-input
          title="Debug Level"
          :buttons="[
            { buttonValue: 30, text: 'Warnungen und Fehler' },
            { buttonValue: 20, text: 'Info' },
            { buttonValue: 10, text: 'Details' },
          ]"
          :model-value="$store.state.mqtt['openWB/system/debug_level']"
          @update:model-value="updateState('openWB/system/debug_level', $event)"
        >
          <template #help>
            Wenn der Debug Level auf "Info" oder "Details" gesetzt wird, werden mehr Informationen in die Logdateien
            geschrieben. Im normalen Betrieb sollte immer "Warnungen und Fehler" gewählt werden, um die Schreibvorgänge
            auf der SD-Karte zu reduzieren.
          </template>
        </openwb-base-button-group-input>
        <openwb-base-alert subtype="warning">
          Achtung! In den Einstellungen "Info" und "Details" können in den Logdateien sensible Daten wie Benutzernamen
          und Passwörter enthalten sein. Diese sollten vor dem Veröffentlichen z.B. im Forum unkenntlich gemacht werden.
          Private IP-Adressen (z.B. 192.168.x.x) müssen nicht maskiert werden, da diese nicht über das Internet
          erreichbar sind.
        </openwb-base-alert>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="debugConfigForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
    <openwb-log-card
      v-for="logFile in logFiles"
      :key="logFile.fileName"
      :title="logFile.title"
      :log-file="logFile.fileName"
    />
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbLogCard from "../components/debug_config/LogCard.vue";

export default {
  name: "OpenwbDebuggingView",
  components: {
    OpenwbLogCard,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/general/extern", "openWB/system/debug_level"],
      logFiles: [
        {
          title: "Main-Log",
          fileName: "/openWB/ramdisk/main.log",
        },
        {
          title: "Log des internen Ladepunktes",
          fileName: "/openWB/ramdisk/internal_chargepoint.log",
        },
        {
          title: "MQTT-Log",
          fileName: "/openWB/ramdisk/mqtt.log",
        },
        {
          title: "SoC-Log",
          fileName: "/openWB/ramdisk/soc.log",
        },
        {
          title: "Protokoll des letzten Updates",
          fileName: "/openWB/data/log/update.log",
        },
        {
          title: "Protokoll des Remote-Dienstes",
          fileName: "/openWB/ramdisk/remote_support.log",
        },
        {
          title: "Protokoll des SmartHome Dienstes",
          fileName: "/openWB/ramdisk/smarthome.log",
        },
        {
          title: "Protokoll der Datenmigration",
          fileName: "/openWB/data/log/data_migration.log",
        },
      ],
    };
  },
};
</script>
