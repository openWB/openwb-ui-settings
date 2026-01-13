<template>
  <div class="pvChargeConfig">
    <form name="pvChargeConfigForm">
      <openwb-base-card title="Regelparameter">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            v-model="controlMode"
            title="Regelmodus"
            :buttons="[
              { buttonValue: 'export', text: 'Einspeisung' },
              { buttonValue: 'import', text: 'Bezug' },
              { buttonValue: 'balanced', text: 'Ausgewogen' },
              { buttonValue: 'individual', text: 'Individuell' },
            ]"
          >
            <template #help>
              Die Ladeleistung kann nicht mit absoluter Genauigkeit eingestellt werden, sodass am EVU-Punkt nicht auf
              exakt 0W geregelt werden kann. Der Regelmodus legt fest, ob diese Differenz am EVU-Punkt (ca. 200-300W) zu
              geringem Netzbezug oder geringer Netzeinspeisung führen soll. Liegt die Leistung am EVU-Punkt innerhalb
              des Regelbereichs, wird nicht nachgeregelt.<br />
              Bei Speichervorrang erzeugt die Regelung bei Bedarf unabhängig vom eingestellten Regelmodus Einspeisung,
              damit der Speicher seine Ladeleistung erhöht.<br />
              Achtung: bei unlogischen Einstellungen kann die Regelung gestört werden! Im Zweifel bitte unsere
              vordefinierten Modi verwenden.
            </template>
          </openwb-base-button-group-input>
          <openwb-base-number-input
            :disabled="controlMode !== 'individual'"
            :readonly="controlMode !== 'individual'"
            title="Minimum"
            :step="0.005"
            unit="kW"
            required
            :model-value="
              Array.isArray($store.state.mqtt['openWB/general/chargemode_config/pv_charging/control_range'])
                ? $store.state.mqtt['openWB/general/chargemode_config/pv_charging/control_range'][0] / 1000
                : undefined
            "
            @update:model-value="
              updateState('openWB/general/chargemode_config/pv_charging/control_range', $event * 1000, '0')
            "
          >
            <template #help> Untere Grenze des Regelbereichs. </template>
          </openwb-base-number-input>
          <openwb-base-number-input
            :disabled="controlMode !== 'individual'"
            :readonly="controlMode !== 'individual'"
            title="Maximum"
            :step="0.005"
            unit="kW"
            required
            :model-value="
              Array.isArray($store.state.mqtt['openWB/general/chargemode_config/pv_charging/control_range'])
                ? $store.state.mqtt['openWB/general/chargemode_config/pv_charging/control_range'][1] / 1000
                : undefined
            "
            @update:model-value="
              updateState('openWB/general/chargemode_config/pv_charging/control_range', $event * 1000, '1')
            "
          >
            <template #help> Obere Grenze des Regelbereichs. </template>
          </openwb-base-number-input>
          <hr />
          <openwb-base-alert :subtype="chargingSwitchRange < 1400 ? 'danger' : 'info'">
            Die Differenzleistung zw. Ein- und Abschaltschwelle sollte mind. 1,4 kW (230V x 6A) betragen. (Konfiguriert:
            {{ (chargingSwitchRange / 1000).toLocaleString(undefined) }}&nbsp;kW)
          </openwb-base-alert>
          <openwb-base-number-input
            title="Einschaltschwelle"
            :min="0"
            :step="0.05"
            unit="kW"
            required
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/switch_on_threshold'] / 1000"
            @update:model-value="
              updateState('openWB/general/chargemode_config/pv_charging/switch_on_threshold', $event * 1000)
            "
          >
            <template #help>
              Wird der Regelbereich in Richtung Einspeisung um diese Leistung überschritten, so wird der Ladevorgang
              gestartet.<br />
              Dieser Wert wird pro Phase genutzt und ist daher immer für eine Phase anzugeben.
            </template>
          </openwb-base-number-input>
          <openwb-base-number-input
            title="Wartezeit Ladestart & Phasenzuschaltung"
            :min="0"
            :step="1"
            unit="s"
            required
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/switch_on_delay']"
            @update:model-value="updateState('openWB/general/chargemode_config/pv_charging/switch_on_delay', $event)"
          >
            <template #help>
              Die Einschaltschwelle muss für die hier angegebene Zeit dauerhaft überschritten werden, bevor ein
              Ladevorgang gestartet wird.<br />
              Wenn ein Ladevorgang aktiv ist und auf PV-Laden umgeschaltet wird, wird weiter geladen, wenn die
              Abschaltschwelle nicht unterschritten wird.<br />
              Wenn die Pufferzeit zwischen zwei automatischen Phasenumschaltungen abgelaufen ist, wird die hier
              eingestellte Wartezeit abgewartet. Wenn die Pufferzeit zwischen zwei Umschaltungen noch nicht erreicht
              ist, wird die längere der beiden Zeiten abgewartet: entweder die verbleibende Pufferzeit oder die
              Wartezeit.
            </template>
          </openwb-base-number-input>
          <hr />
          <openwb-base-alert
            :subtype="
              $store.state.mqtt['openWB/general/chargemode_config/pv_charging/switch_off_threshold'] / 1000 > 0
                ? 'danger'
                : 'info'
            "
          >
            Ist ein Speicher im System vorhanden, kann eine Abschaltschwelle größer Null zur Speicherentladung führen.
            (Siehe Fragezeichentext)
          </openwb-base-alert>
          <openwb-base-number-input
            title="Abschaltschwelle"
            :step="0.05"
            unit="kW"
            required
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/switch_off_threshold'] / 1000"
            @update:model-value="
              updateState('openWB/general/chargemode_config/pv_charging/switch_off_threshold', $event * 1000)
            "
          >
            <template #help>
              Übersteigt der Netzbezug die Abschaltschwelle, wird die Ladung beendet. Eine Abschaltschwelle, die
              Netzbezug erlaubt, führt in einem System ohne steuerbaren Speicher zur Entladung des Speichers. Der
              Speicher wird dann auch über den eingestellten Mindest-SoC hinaus entladen (siehe Speicherbeachtung
              unten).
            </template>
          </openwb-base-number-input>
          <openwb-base-number-input
            title="Wartezeit Ladeende & Phasenreduktion"
            :min="0"
            :step="1"
            unit="s"
            required
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/switch_off_delay']"
            @update:model-value="updateState('openWB/general/chargemode_config/pv_charging/switch_off_delay', $event)"
          >
            <template #help>
              Die Abschaltschwelle muss für die hier angegebene Zeit dauerhaft unterschritten werden, bevor ein
              Ladevorgang beendet wird.<br />
              Wenn ein Ladevorgang aktiv ist und auf PV-Laden umgeschaltet wird, wird die Ladung sofort beendet, wenn
              die Abschaltschwelle unterschritten wird.<br />
              Wenn die Pufferzeit zwischen zwei automatischen Phasenumschaltungen abgelaufen ist, wird die hier
              eingestellte Wartezeit abgewartet. Wenn die Pufferzeit zwischen zwei Umschaltungen noch nicht erreicht
              ist, wird die längere der beiden Zeiten abgewartet: entweder die verbleibende Pufferzeit oder die
              Wartezeit.
            </template>
          </openwb-base-number-input>
          <hr />
          <openwb-base-button-group-input
            title="Phasenumschaltung wiederholt anstoßen"
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/retry_failed_phase_switches']"
            @update:model-value="
              updateState('openWB/general/chargemode_config/pv_charging/retry_failed_phase_switches', $event)
            "
          >
            <template #help>
              Phasenumschaltungen werden zum Schutz der EV- und WB-Hardware begrenzt.<br />
              Wenn diese Option aktiviert ist, werden bis zu zwei Umschaltversuche vorgenommen, wenn die vorgegebene und
              genutzte Phasenzahl nicht übereinstimmen. Wird die Option deaktiviert, wird nur eine Umschaltung
              durchgeführt.<br />
              Die gezählten Fehlversuche werden beim nächsten Wechsel des Lademodus oder mit dem Abstecken
              zurückgesetzt.
            </template>
          </openwb-base-button-group-input>
          <openwb-base-number-input
            title="Pufferzeit zwischen automat. Phasenumschaltungen"
            unit="Min."
            :min="5"
            :max="180"
            :step="1"
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/phase_switch_delay']"
            @update:model-value="updateState('openWB/general/chargemode_config/pv_charging/phase_switch_delay', $event)"
          >
            <template #help>
              Um zu viele Umschaltungen zu vermeiden, wird mindestens die hier eingestellte Zeit zwischen zwei
              Umschaltungen abgewartet. Das Umschalten auf mehrphasiges Laden erfolgt nur, wenn mit der maximalen
              Stromstärke geladen wird und genug Leistung für mehrphasiges Laden zur Verfügung steht. Auf einphasiges
              Laden wird zurückgeschaltet, wenn auf die minimale Stromstärke heruntergeregelt wurde. Die Verzögerung
              wird nur bei der automatischen Phasenumschaltung bei Überschuss-Laden abgewartet.<br />
              Ist ausreichend Überschuss vorhanden, wird beim Ladestart die Umschaltverzögerung nicht abgewartet,
              sondern direkt mit mehrphasiger Ladung begonnen.
            </template>
          </openwb-base-number-input>
          <hr />
          <openwb-base-number-input
            title="Regelpunkt Einspeisegrenze"
            :min="-1000"
            :step="0.05"
            unit="kW"
            required
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/feed_in_yield'] / 1000"
            @update:model-value="
              updateState('openWB/general/chargemode_config/pv_charging/feed_in_yield', $event * 1000)
            "
          >
            <template #help>
              Ein Wert größer 0kW bewirkt, dass weniger PV-Leistung zum Laden benutzt wird.<br />
              Die Nutzung dieser Option ergibt nur Sinn, wenn ein Wechselrichter in irgendeiner Form abgeregelt wird
              Weitere Infos dazu im
              <a
                href="https://wiki.openwb.de/doku.php?id=openwb:vc:2.1.9:software:einstell-konfig:ladeeinstellungen:pv-laden-speicherbeachtung#regelpunkt_einspeisegrenze"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wiki-Beitrag zur Beachtung der Einspeisegrenze </a
              >.<br />
              Bei Erreichen dieses Werts wird die PV-Ladung nacheinander für jedes Fahrzeug im PV-Modus gestartet, bei
              welchem "Einspeisegrenze beachten" im Ladeprofil aktiviert ist, dies setzt die Einschaltschwelle außer
              kraft!<br />
              Zur optimalen Eigenverbrauchssteuerung sollte der Wert einige hundert Watt UNTER der im Wechselrichter
              hinterlegten EVU-Einspeiseleistungsgrenze liegen, damit openWB die Ladung freigibt, BEVOR der
              Wechselrichter begrenzt wird.
            </template>
          </openwb-base-number-input>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="pvChargeConfigForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCarBattery as fasCarBattery,
  faCarSide as fasCarSide,
  faBatteryHalf as fasBatteryHalf,
} from "@fortawesome/free-solid-svg-icons";

library.add(fasCarBattery, fasCarSide, fasBatteryHalf);

export default {
  name: "OpenwbSurplusChargeConfigView",
  components: {},
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/general/chargemode_config/pv_charging/control_range",
        "openWB/general/chargemode_config/pv_charging/feed_in_yield",
        "openWB/general/chargemode_config/pv_charging/phase_switch_delay",
        "openWB/general/chargemode_config/pv_charging/switch_on_threshold",
        "openWB/general/chargemode_config/pv_charging/retry_failed_phase_switches",
        "openWB/general/chargemode_config/pv_charging/switch_on_delay",
        "openWB/general/chargemode_config/pv_charging/switch_off_threshold",
        "openWB/general/chargemode_config/pv_charging/switch_off_delay",
        "openWB/general/chargemode_config/pv_charging/phases_to_use",
      ],
      calculatedControlMode: undefined,
    };
  },
  computed: {
    controlMode: {
      get() {
        if (this.calculatedControlMode !== undefined) {
          return this.calculatedControlMode;
        }
        const topic = "openWB/general/chargemode_config/pv_charging/control_range";
        let state = this.$store.state.mqtt[topic];
        var controlMode = "individual";
        if (typeof state != "undefined") {
          if (state[0] === -230 && state[1] === 0) {
            controlMode = "export";
          } else if (state[0] === 0 && state[1] === 230) {
            controlMode = "import";
          } else if (state[0] === -115 && state[1] === 115) {
            controlMode = "balanced";
          } else {
            controlMode = "individual";
          }
        }
        return controlMode;
      },
      set(newMode) {
        const topic = "openWB/general/chargemode_config/pv_charging/control_range";
        this.calculatedControlMode = newMode;
        switch (newMode) {
          case "export":
            this.updateState(topic, [-230, 0]);
            break;
          case "import":
            this.updateState(topic, [0, 230]);
            break;
          case "balanced":
            this.updateState(topic, [-115, 115]);
            break;
          case "individual":
            break;
        }
      },
    },
    chargingSwitchRange: {
      get() {
        return (
          this.$store.state.mqtt["openWB/general/chargemode_config/pv_charging/switch_on_threshold"] +
          this.$store.state.mqtt["openWB/general/chargemode_config/pv_charging/switch_off_threshold"]
        );
      },
    },
  },
  watch: {
    controlMode(newMode) {
      this.calculatedControlMode = newMode;
    },
  },
};
</script>
