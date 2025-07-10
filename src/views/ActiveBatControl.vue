<template>
  <div class="batteryConfig">
    <form name="batteryConfigForm">
      <openwb-base-card title="Passive Speicher-Beachtung">
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
      <openwb-base-card title="Aktive Speichersteuerung">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-alert subtype="info" class="mb-3">
          <p>
            Die aktive Speichersteuerung durch openWB basiert auf öffentlich zugänglichen Informationen zu den verschiedenen Speichersystemen. Diese können auch nicht herstellerseitig freigegebene Informationen beinhalten.<br />
            Fragen bezüglich der Gewährleistung und Hardwarekompatibilität sind vor der Nutzung mit dem Hersteller zu klären. openWB übernimmt keine Haftung für Schäden, welche aus der Nutzung der "aktiven Speichersteuerung" entstehen.
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
            <openwb-base-heading class="mt-0"> Speicher-Entladung ins Fahrzeug steuern </openwb-base-heading>
            <div v-if="$store.state.mqtt['openWB/bat/get/power_limit_controllable'] === true">
              <openwb-base-button-group-input
                title="Speicher-Entladung"
                :buttons="[
                  {
                    buttonValue: 'no_limit',
                    text: 'immer',
                  },
                  {
                    buttonValue: 'limit_stop',
                    text: 'gesperrt, wenn Fahrzeug lädt',
                  },
                  {
                    buttonValue: 'limit_to_home_consumption',
                    text: 'für Hausverbrauch',
                  },
                ]"
                :model-value="$store.state.mqtt['openWB/bat/config/power_limit_mode']"
                @update:model-value="updateState('openWB/bat/config/power_limit_mode', $event)"
              >
                <template #help>
                  Wenn das Entladen des Speichers immer erlaubt ist, wird das Fahrzeug aus dem Speicher geladen anstatt
                  Strom aus dem Netz zu beziehen. <br />
                  Im Modus "gesperrt, wenn Fahrzeug lädt", wird die Entladung nur zugelassen, wenn alle Fahrzeuge im Modus
                  PV-Laden ohne Mindeststrom oder Zielladen mit PV-Überschuss laden.<br />
                  Wenn das Entladen des Speichers auf den Hausverbrauch begrenzt ist und mindestens Fahrzeuge nicht im
                  Modus PV-Laden ohne Mindeststrom oder Zielladen lädt, wird die Entladung des Speichers in Höhe des
                  Hausverbrauchs zugelassen. Kann die Entladung am Speicher nur komplett gesperrt werden, verhält sich
                  diese Einstellung wie "gesperrt, wenn Fahrzeug lädt".<br />
                  Diese Einstellung übersteuert ggf die Einstellungen zur Speicher-Beachtung im Modus PV-Laden.
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
