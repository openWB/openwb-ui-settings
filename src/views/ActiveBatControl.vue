<template>
  <div class="batteryConfig">
    <form name="batteryConfigForm">
      <openwb-base-card title="Passive Speicherbeachtung (PV)">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-alert subtype="info">
            Die Regelmodi der Speicherbeachtung erfolgen "passiv" durch Anpassung der Fahrzeug-Ladeleistung.
            PV-Überschuss wird, je nach Konfiguration, entweder dem Fahrzeug zugeteilt oder dem Speicher überlassen.
            Netz- und Speicherbezug wird, sofern nicht anders konfiguriert, vermieden.
          </openwb-base-alert>
          <openwb-base-button-group-input
            v-model="batMode"
            title="Ladepriorität"
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
              Nach SoC des Speichers
            </template>
            <template #help>
              <div v-if="batMode === 'ev_mode'">
                Der gesamte Überschuss wird in das EV geladen. Wird mehr Überschuss erzeugt als die Fahrzeuge abnehmen,
                findet auch eine Speicherladung statt.
              </div>
              <div v-if="batMode === 'bat_mode'">
                Der gesamte Überschuss wird in den Speicher geladen. Ist die maximale Ladeleistung des Speichers
                erreicht und es wird eingespeist, wird dieser Überschuss unter Beachtung der Einschaltschwelle in die
                Fahrzeuge geladen.
              </div>
              <div v-if="batMode === 'min_soc_bat_mode'">
                Verhält sich bis zum Erreichen des Mindest-SoC wie "Ladepriorität Speicher" und oberhalb des Mindest-SoC
                wie "Ladepriorität Fahrzeuge". Die maximale Leistung der Speicherbe- und entladung lässt sich hier
                festlegen.
              </div>
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
              @update:model-value="
                (updateState('openWB/general/chargemode_config/pv_charging/min_bat_soc', $event),
                updateState(
                  'openWB/general/chargemode_config/pv_charging/max_bat_soc',
                  $store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc'] <
                    $store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc']
                    ? $store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc']
                    : $event,
                ))
              "
            >
              <template #help>
                Unterhalb des Mindest-SoC wird vorhandener PV-Überschuss bevorzugt in den Speicher geladen. Oberhalb des
                Mindest-SoC hat die Fahrzeugladung Priorität.
              </template>
            </openwb-base-range-input>
            <openwb-base-range-input
              title="Maximal-SoC des Speichers"
              :min="0"
              :max="100"
              :step="1"
              unit="%"
              required
              :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc']"
              @update:model-value="
                (updateState('openWB/general/chargemode_config/pv_charging/max_bat_soc', $event),
                updateState(
                  'openWB/general/chargemode_config/pv_charging/min_bat_soc',
                  $store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc'] >
                    $store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc']
                    ? $store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc']
                    : $event,
                ))
              "
            >
              <template #help>
                Wird der Maximal-SoC überschritten, darf der Speicher bis zum Erreichen des Mindest-SoC zur
                Fahrzeugladung mitbenutzt werden.
              </template>
            </openwb-base-range-input>
            <openwb-base-alert
              v-if="
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc'] ==
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc']
              "
              subtype="info"
            >
              Bei identischen SoC Angaben findet keine Speicherhysterese statt.
            </openwb-base-alert>
            <openwb-base-heading> Speicher-Ladeleistung unterhalb Mindest-SoC </openwb-base-heading>
            <openwb-base-button-group-input
              title="Nur eine bestimmte Ladeleistung reservieren"
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
              <template
                v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve_active']"
                #help
              >
                ACHTUNG: Der hier eingestellte Wert darf die maximale Ladeleistung des Speichers nicht überschreiten!<br />
                Befindet sich der Speicher unterhalb des Mindest-SoC, wird er mit der hier eingestellten
                Speicherladeleistung geladen. Verbleibender Überschuss wird in die Fahrzeuge geladen.
              </template>
              <template
                v-else
                #help
              >
                Befindet sich der Speicher unterhalb des Mindest-SoC, wird er priorisiert geladen.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-number-input
              v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve_active']"
              title="Reservierte Ladeleistung"
              :min="0.1"
              :step="0.1"
              unit="kW"
              required
              :model-value="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve'] / 1000"
              @update:model-value="
                updateState('openWB/general/chargemode_config/pv_charging/bat_power_reserve', $event * 1000)
              "
            />
            <openwb-base-heading> Speicher-SoC oberhalb Maximal-SoC </openwb-base-heading>
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
              <template
                v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_discharge_active']"
                #help
              >
                ACHTUNG: Der hier eingestellte Wert darf die maximale Entadeleistung des Speichers nicht überschreiten!
                Wird der Maximal-SoC überschritten, wird die PV-Ladung mit der hier eingestellten
                Speicherentladeleistung unterstützt. Der Speicher darf bis zum Mindest-SoC entladen werden. Die erlaubte
                Entladeleistung des Speichers wird dem Überschuss zum Erreichen der Einschaltschwelle hinzugerechnet.
              </template>
              <template
                v-else
                #help
              >
                Oberhalb des Maximal-SoC wird der Speicher nicht für die Fahrzeugladung mitgenutzt.
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
      <openwb-base-card title="Aktive Speichersteuerung">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-alert
            subtype="info"
            class="mb-3"
          >
            <p>
              Die aktive Speichersteuerung durch openWB basiert auf öffentlich zugänglichen Informationen zu den
              verschiedenen Speichersystemen. Diese können auch nicht herstellerseitig freigegebene Informationen
              beinhalten.<br />
              Fragen bezüglich der Gewährleistung und Hardwarekompatibilität sind vor der Nutzung mit dem Hersteller zu
              klären. openWB übernimmt keine Haftung für Schäden, welche aus der Nutzung der "aktiven Speichersteuerung"
              entstehen.
            </p>
            <openwb-base-button-group-input
              title="Hinweise zur aktiven Speichersteuerung gelesen und akzeptiert"
              :buttons="[
                { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
                { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
              ]"
              :model-value="$store.state.mqtt['openWB/bat/config/bat_control_permitted']"
              @update:model-value="updateState('openWB/bat/config/bat_control_permitted', $event)"
            />
          </openwb-base-alert>

          <div v-if="$store.state.mqtt['openWB/bat/config/bat_control_permitted'] === true">
            <openwb-base-heading class="mt-0"> Regelmodi der aktiven Speichersteuerung </openwb-base-heading>
            <openwb-base-alert subtype="info">
              Die aktive Speichersteuerung kann Speicherentladung in allen Lademodi begrenzen - z.B. Vermeidung von
              Netzbezug bei Sofortladen. Die erlaubte Entladeleistung des Speichers (Speicherbeachtung PV) wird bei
              aktiver Speichersteuerung überschrieben, da Speicherentladung aktiv begrenzt wird.
            </openwb-base-alert>
            <div v-if="$store.state.mqtt['openWB/bat/get/power_limit_controllable'] === true">
              <openwb-base-button-group-input
                v-model="powerLimit"
                title="Speichersteuerung"
                :buttons="[
                  {
                    buttonValue: 'no_limit',
                    text: 'Aus',
                  },
                  {
                    buttonValue: 'limit_stop',
                    text: 'volle Entladesperre',
                  },
                  {
                    buttonValue: 'limit_to_home_consumption',
                    text: 'Entladung in Fahrzeuge sperren',
                  },
                ]"
                :model-value="$store.state.mqtt['openWB/bat/config/power_limit_mode']"
                @update:model-value="updateState('openWB/bat/config/power_limit_mode', $event)"
              >
                <template #help>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_mode'] === 'no_limit'">
                    Der Speicher regelt eigenständig und wird nicht gesteuert. Es greift nur die konfigurierte
                    Speicherbeachtung.
                  </div>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_mode'] === 'limit_stop'">
                    Die Speicherentladung wird komplett gesperrt, sobald ein Fahrzeug lädt! Alle Verbraucher (Fahrzeuge,
                    Hausverbrauch) werden durch Netzstrom versorgt.
                  </div>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_mode'] === 'limit_to_home_consumption'">
                    Fahrzeugladung erzeugt Netzbezug statt Speicherentladung. Weitere Verbraucher (bspw. Hausverbrauch)
                    werden durch den Speicher ausgeglichen. Kann die Entladung am Speicher nur komplett gesperrt werden,
                    verhält sich diese Einstellung wie "volle Entladesperre".
                  </div>
                </template>
              </openwb-base-button-group-input>
            </div>
            <div v-else>
              <openwb-base-alert subtype="info">
                Die Speicher-Entladung ins Fahrzeug kann nicht gesteuert werden, da die Entladeleistung nicht an den/die
                konfigurierten Speicher übergeben werden kann.
              </openwb-base-alert>
            </div>
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="batteryConfigForm"
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
        "openWB/general/chargemode_config/pv_charging/bat_mode",
        "openWB/general/chargemode_config/pv_charging/bat_power_reserve",
        "openWB/general/chargemode_config/pv_charging/bat_power_reserve_active",
        "openWB/general/chargemode_config/pv_charging/bat_power_discharge",
        "openWB/general/chargemode_config/pv_charging/bat_power_discharge_active",
        "openWB/general/chargemode_config/pv_charging/min_bat_soc",
        "openWB/general/chargemode_config/pv_charging/max_bat_soc",
        "openWB/bat/config/bat_control_permitted",
        "openWB/bat/get/power_limit_controllable",
        "openWB/bat/config/power_limit_mode",
      ],
    };
  },
  computed: {
    batMode: {
      get() {
        return this.$store.state.mqtt["openWB/general/chargemode_config/pv_charging/bat_mode"];
      },
      set(newMode) {
        this.updateState("openWB/general/chargemode_config/pv_charging/bat_mode", newMode);
      },
    },
  },
};
</script>
