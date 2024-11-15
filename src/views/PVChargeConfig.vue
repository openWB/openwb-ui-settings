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
              geringem Netzbezug oder geringer Netzeinspeisung führen soll.<br />
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
            title="Einschaltverzögerung"
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
              Abschaltschwelle nicht unterschritten wird.
            </template>
          </openwb-base-number-input>
          <hr />
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
              Wird der Regelbereich in Richtung Netzbezug um diese Leistung überschritten, so wird der Ladevorgang
              beendet. Wenn ein Speicher im System vorhanden ist, gilt die Abschaltschwelle auch für die
              Speicherentladung. Die Abschaltschwelle übersteuert den Mindest-SoC des Speichers (siehe
              Speicher-Beachtung unten).<br />
              Dieser Wert ist unabhängig von der Anzahl genutzter Phasen.
            </template>
          </openwb-base-number-input>
          <openwb-base-number-input
            title="Abschaltverzögerung"
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
              die Abschaltschwelle unterschritten wird.
            </template>
          </openwb-base-number-input>
          <hr />
          <openwb-base-number-input
            title="Regelpunkt Einspeisegrenze"
            :min="0"
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
              Die Nutzung dieser Option ergibt nur Sinn, wenn ein Wechselrichter mit separatem Smart-Meter am EVU-Punkt
              verbaut ist (nicht der originale Zähler des Versorgers!), welches eine dynamische Begrenzung der
              Einspeiseleistung am EVU-Punkt durch den PV-Wechselrichter bietet (bitte bei ev. Problemen immer vorab
              prüfen lassen).<br />
              Ist eine Einspeiseleistungsreduzierung verbaut (in vielen älteren, privaten Einspeiseverträgen z.B. als
              70% Regelung bekannt), wird mit Eingabe des Wertes "Regelpunkt Einspeisegrenze" ein
              eigenverbrauchsoptimiertes Fahrzeugladen mit PV-Überschussenergie möglich, die sonst abgeregelt werden
              würde (Nutzung der PV-Peaks).<br />
              Wird in einem "Ladeprofil" die Option "Einspeisegrenze beachten" eingeschaltet, so wird der Regelpunkt auf
              diesen Wert verschoben und die Ladung startet erst, wenn der hinterlegte Wert "Regelpunkt Einspeisegrenze"
              überschritten wird.<br />
              Zur optimalen Eigenverbrauchssteuerung sollte der Wert einige hundert Watt UNTER der im Wechselrichter
              hinterlegten EVU-Einspeiseleistungsgrenze liegen, damit openWB die Ladung freigibt, BEVOR der
              Wechselrichter begrenzt wird.
            </template>
          </openwb-base-number-input>
        </div>
      </openwb-base-card>
      <openwb-base-card title="Phasenumschaltung">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            title="Anzahl Phasen"
            :buttons="[
              { buttonValue: 1, text: '1' },
              { buttonValue: 3, text: 'Maximum' },
              { buttonValue: 0, text: 'Automatik' },
            ]"
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/phases_to_use']"
            @update:model-value="updateState('openWB/general/chargemode_config/pv_charging/phases_to_use', $event)"
          >
            <template #help>
              Hier kann eingestellt werden, ob Ladevorgänge im Modus "PV-Laden" mit nur einer Phase oder dem möglichen
              Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus
              "Automatik" entscheidet die Regelung, welche Einstellung genutzt wird, um den verfügbaren Überschuss in
              die Fahrzeuge zu laden. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen einer und mehreren
              Phasen (sog. 1p3p).
            </template>
          </openwb-base-button-group-input>
        </div>
      </openwb-base-card>
      <openwb-base-card title="Speicher-Beachtung">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            v-model="batMode"
            title="Laden mit Überschuss"
            :buttons="[{ buttonValue: 'ev_mode' }, { buttonValue: 'bat_mode' }, { buttonValue: 'min_soc_bat_mode' }]"
          >
            <template #label-ev_mode>
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car-side']"
              />
              Fahrzeuge
            </template>
            <template #label-bat_mode>
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'fa-car-battery']"
              />
              Speicher
            </template>
            <template #label-min_soc_bat_mode>
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'fa-battery-half']"
              />
              Mindest-SoC des Speichers
            </template>
            <template #help>
              <p>
                Sofern ein Hausstromspeicher (im Folgenden "Speicher" genannt) im Energiesystem verbaut ist, kann dieser
                beim Fahrzeugladen mit berücksichtigt werden. Dies erfolgt passiv über die Berücksichtigung der
                Speicherleistungswerte und des Speicher-SoC. Eine aktive Speichersteuerung durch openWB ist aktuell
                mangels Speicherschnittstelle nicht möglich.
              </p>
              <p>
                Bei Auswahl "
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'car-side']"
                />
                Fahrzeuge" wird der gesamte Überschuss in das EV geladen. Ist die maximale Ladeleistung der Fahrzeuge
                erreicht und es wird eingespeist, wird dieser Überschuss in den Speicher geladen.
              </p>
              <p>
                Bei Auswahl "
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'fa-car-battery']"
                />
                Speicher" wird der gesamte Überschuss in den Speicher geladen. Ist die maximale Ladeleistung des
                Speichers erreicht und es wird eingespeist, wird dieser Überschuss unter Beachtung der Einschaltschwelle
                in die Fahrzeuge geladen.
              </p>
              <p>
                Bei Auswahl "
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'fa-battery-half']"
                />
                Mindest-SoC des Speichers" wird der Überschuss bis zum Mindest-SoC in den Speicher geladen. Ist die
                maximale Ladeleistung des Speichers erreicht und es wird eingespeist, wird dieser Überschuss in die
                Fahrzeuge geladen. Wird der Mindest-SoC überschritten, wird der Überschuss ins Fahrzeug geladen.
              </p>
            </template>
          </openwb-base-button-group-input>
          <div v-if="batMode === 'min_soc_bat_mode'">
            <openwb-base-range-input
              title="Mindest-SoC des Speichers"
              :min="0"
              :max="100"
              :step="1"
              unit="%"
              required
              :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc']"
              @update:model-value="updateState('openWB/general/chargemode_config/pv_charging/min_bat_soc', $event)"
            />
            <openwb-base-heading> Speicher-SoC unterhalb Mindest-SoC </openwb-base-heading>
            <openwb-base-button-group-input
              title="Ladeleistung für Speicher reservieren"
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
              :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve_active']"
              @update:model-value="
                updateState('openWB/general/chargemode_config/pv_charging/bat_power_reserve_active', $event)
              "
            >
              <template #help>
                ACHTUNG: Der hier eingestellte Wert darf die maximale Ladeleistung des Speichers nicht überschreiten.<br />
                Wird der Mindest-SoC des Speichers nicht erreicht, wird der Speicher mit der hier eingestellten Leistung
                geladen. Mit dem verbleibenden Überschuss werden die Fahrzeuge geladen.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-number-input
              v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve_active']"
              title="Reserve Ladeleistung"
              :min="0.1"
              :step="0.1"
              unit="kW"
              required
              :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve'] / 1000"
              @update:model-value="
                updateState('openWB/general/chargemode_config/pv_charging/bat_power_reserve', $event * 1000)
              "
            />
            <openwb-base-heading> Speicher-SoC oberhalb Mindest-SoC </openwb-base-heading>
            <openwb-base-button-group-input
              title="Entladung des Speichers erlauben"
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
              :model-value="
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_discharge_active']
              "
              @update:model-value="
                updateState('openWB/general/chargemode_config/pv_charging/bat_power_discharge_active', $event)
              "
            >
              <template #help>
                Wird der Mindest-SoC überschritten, wird der Überschuss ins Fahrzeug geladen und der Speicher mit der
                hier eingestellten Leistung in die Fahrzeuge entladen. Die Entladeleistung des Speichers wird dem
                Überschuss zum Erreichen der Einschaltschwelle hinzugerechnet.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-number-input
              v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_discharge_active']"
              title="Erlaubte Entladeleistung"
              :min="0.1"
              :step="0.1"
              unit="kW"
              required
              :model-value="
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_discharge'] / 1000
              "
              @update:model-value="
                updateState('openWB/general/chargemode_config/pv_charging/bat_power_discharge', $event * 1000)
              "
            />
          </div>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCarBattery, fasCarSide, fasBatteryHalf);

export default {
  name: "OpenwbPVChargeConfigView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/general/chargemode_config/pv_charging/control_range",
        "openWB/general/chargemode_config/pv_charging/feed_in_yield",
        "openWB/general/chargemode_config/pv_charging/switch_on_threshold",
        "openWB/general/chargemode_config/pv_charging/switch_on_delay",
        "openWB/general/chargemode_config/pv_charging/switch_off_threshold",
        "openWB/general/chargemode_config/pv_charging/switch_off_delay",
        "openWB/general/chargemode_config/pv_charging/phases_to_use",
        "openWB/general/chargemode_config/pv_charging/bat_mode",
        "openWB/general/chargemode_config/pv_charging/bat_power_reserve",
        "openWB/general/chargemode_config/pv_charging/bat_power_reserve_active",
        "openWB/general/chargemode_config/pv_charging/bat_power_discharge",
        "openWB/general/chargemode_config/pv_charging/bat_power_discharge_active",
        "openWB/general/chargemode_config/pv_charging/min_bat_soc",
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
    batMode: {
      get() {
        return this.$store.state.mqtt["openWB/general/chargemode_config/pv_charging/bat_mode"];
      },
      set(newMode) {
        this.updateState("openWB/general/chargemode_config/pv_charging/bat_mode", newMode);
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
