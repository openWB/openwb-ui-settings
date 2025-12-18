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
            Die Regelmodi der Speicherbeachtung erfolgen "passiv" durch Anpassung der Fahrzeug-Ladeleistung. PV-Überschuss
            wird, je nach Konfiguration, entweder dem Fahrzeug zugeteilt oder dem Speicher überlassen. Netz- und 
            Speicherbezug wird, sofern nicht anders konfiguriert, vermieden.
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
                Der gesamte Überschuss wird in das EV geladen. Wird mehr Überschuss erzeugt 
                als die Fahrzeuge abnehmen, findet auch eine Speicherladung statt.
              </div>
              <div v-if="batMode === 'bat_mode'">
                Der gesamte Überschuss wird in den Speicher geladen. Ist die maximale Ladeleistung des
                Speichers erreicht und es wird eingespeist, wird dieser Überschuss unter Beachtung der Einschaltschwelle
                in die Fahrzeuge geladen.
              </div>
              <div v-if="batMode === 'min_soc_bat_mode'">
                Verhält sich bis zum Erreichen des Mindest-SoC wie "Ladepriorität Speicher" und oberhalb 
                des Mindest-SoC wie "Ladepriorität Fahrzeuge".
                Die maximale Leistung der Speicherbe- und entladung lässt sich hier festlegen.
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
                updateState('openWB/general/chargemode_config/pv_charging/min_bat_soc', $event),
                updateState('openWB/general/chargemode_config/pv_charging/max_bat_soc',
                ($store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc'] <
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc']) ?
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc'] :
                $event)
              "
            >
              <template #help>
                Unterhalb des Mindest SoC wird vorhandener PV-Überschuss bevorzugt in den Speicher geladen.
                Oberhalb des Mindest-SoC hat die Fahrzeugladung Priorität.
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
                updateState('openWB/general/chargemode_config/pv_charging/max_bat_soc', $event),
                updateState('openWB/general/chargemode_config/pv_charging/min_bat_soc',
                ($store.state.mqtt['openWB/general/chargemode_config/pv_charging/max_bat_soc'] >
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc']) ?
                $store.state.mqtt['openWB/general/chargemode_config/pv_charging/min_bat_soc'] :
                $event)
              "
            >
              <template #help>
                Wird der Maximal-SoC überschritten, darf der Speicher bis zum Erreichen des Mindest-SoC
                zur Fahrzeugladung mitbenutzt werden.
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
              <template #help
                v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_reserve_active']"
              >
                ACHTUNG: Der hier eingestellte Wert darf die maximale Ladeleistung des Speichers nicht überschreiten!<br />
                Befindet sich der Speicher unterhalb des Mindest-SoC, wird er mit der hier eingestellten 
                Speicherladeleistung geladen. Verbleibender Überschuss wird in die Fahrzeuge geladen.
              </template>
              <template #help v-else >
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
              <template #help
                v-if="$store.state.mqtt['openWB/general/chargemode_config/pv_charging/bat_power_discharge_active']"
              >
                ACHTUNG: Der hier eingestellte Wert darf die maximale Entadeleistung des Speichers nicht überschreiten!
                Wird der Maximal-SoC überschritten, wird die PV-Ladung mit der hier eingestellten Speicherentladeleistung 
                unterstützt. Der Speicher darf bis zum Mindest-SoC entladen werden. Die erlaubte Entladeleistung des Speichers
                wird dem Überschuss zum Erreichen der Einschaltschwelle hinzugerechnet.
              </template>
              <template #help v-else>
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
          <openwb-base-alert subtype="info" class="mb-3">
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
              Die aktive Speichersteuerung kann Speicherentladung begrenzen oder den Speicher zur Ladung zwingen.
              Die erlaubte Entladeleistung des Speichers (Speicherbeachtung PV) wird bei aktiver Speichersteuerung
              überschrieben, da Speicherentladung unter Umständen aktiv begrenzt wird.
            </openwb-base-alert>
            <openwb-base-button-group-input
              title="Speicher aktiv Steuern"
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
              :model-value="$store.state.mqtt['openWB/bat/config/bat_control_activated']"
              @update:model-value="
                updateState('openWB/bat/config/bat_control_activated', $event)
              "
            >
              <template #help
                v-if="$store.state.mqtt['openWB/bat/config/bat_control_activated']"
              >
                Speicher wird aktiv gesteuert. Grundlage ist die nachfolgende Konfiguration.
              </template>
              <template #help v-else >
                Speicher wird nicht aktiv gesteuert, sondern regelt eigenständig.<br />
                Es greifen die Regelparameter der Speicherbeachtung.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-card title="Aktiv steuerbare Speicher">
              <openwb-base-alert subtype="danger"
                v-if="containsNormalBatteries"
              >
                Es sind weitere, nicht steuerbare Speicher im System vorhanden. Solche Speicher führen gewöhnlich
                eigenständig eine Nullpunktausregelung durch, versuchen also Überschuss zu speichern (Einspeisung zu verhindern)
                und Netzbezug durch eigene Entladung zu vermeiden.<br />
                Ein solcher Speicher versucht ebenso aktiv gesteuerte Speicher auszugleichen.
              </openwb-base-alert>
              <div
                  v-for="(batteryConfig, index) in batteryConfigs"
              >
                <openwb-base-card
                  v-if="$store.state.mqtt['openWB/bat/'+batteryConfig.id+'/get/power_limit_controllable'] === true"
                  :key="index"
                  :title="batteryConfig.name + ' (ID: ' + batteryConfig.id + ')'"
                  :collapsible="true"
                  :collapsed="true"
                  subtype="warning"
                >
                  <template #header>
                    <font-awesome-icon :icon="['fas', 'fa-car-battery']" />
                    {{ batteryConfig.name }} (ID: {{ batteryConfig.id }})
                  </template>
                  <openwb-base-number-input
                    :key="index"
                    title="Maximale Entladeleistung"
                    :min="0.1"
                    :step="0.1"
                    unit="kW"
                    required
                    :model-value="
                      $store.state.mqtt['openWB/bat/'+batteryConfig.id+'/get/max_discharge_power'] / 1000
                    "
                    @update:model-value="
                      updateState('openWB/bat/'+batteryConfig.id+'/get/max_discharge_power', $event * 1000)
                    "
                  />
                  <openwb-base-number-input
                    :key="index"
                    title="Maximale Ladeleistung"
                    :min="0.1"
                    :step="0.1"
                    unit="kW"
                    required
                    :model-value="
                      $store.state.mqtt['openWB/bat/'+batteryConfig.id+'/get/max_charge_power'] / 1000
                    "
                    @update:model-value="
                      updateState('openWB/bat/'+batteryConfig.id+'/get/max_charge_power', $event * 1000)
                    "
                  />
                </openwb-base-card>
                <hr />
              </div>
            </openwb-base-card>
            <div v-if="$store.state.mqtt['openWB/bat/get/power_limit_controllable'] === true">

              <openwb-base-range-input
                title="Untere Entladeschranke"
                :min="0"
                :max="100"
                :step="1"
                unit="%"
                required
                :model-value="$store.state.mqtt['openWB/bat/config/bat_control_min_soc']"
                @update:model-value="
                  updateState('openWB/bat/config/bat_control_min_soc', $event),
                  updateState('openWB/bat/config/bat_control_max_soc',
                  ($store.state.mqtt['openWB/bat/config/bat_control_min_soc'] <
                  $store.state.mqtt['openWB/bat/config/bat_control_max_soc']) ?
                  $store.state.mqtt['openWB/bat/config/bat_control_max_soc'] :
                  $event)
                "

              >
                <template #help>
                  Speicher welche durch die aktive Steuerung entladen werden, schalten unterhalb des eingestellten SoC
                  auf "Eigenregelung" um mögliche Tiefenentladung zu verhindern. Die aktive Ladung ist
                  weiterhin möglich.
                </template>
              </openwb-base-range-input>
              <openwb-base-range-input
                title="Obere Ladeschranke"
                :min="0"
                :max="100"
                :step="1"
                unit="%"
                required
                :model-value="$store.state.mqtt['openWB/bat/config/bat_control_max_soc']"
                @update:model-value="
                  updateState('openWB/bat/config/bat_control_max_soc', $event),
                  updateState('openWB/bat/config/bat_control_min_soc',
                  ($store.state.mqtt['openWB/bat/config/bat_control_max_soc'] >
                  $store.state.mqtt['openWB/bat/config/bat_control_min_soc']) ?
                  $store.state.mqtt['openWB/bat/config/bat_control_min_soc'] :
                  $event)
                "
              >
                <template #help>
                  Speicher welche aktiv geladen werden sperren oberhalb des eingestellten SoC die Entladung
                  oder schalten auf Eigenregelung des Speichers.
                </template>
              </openwb-base-range-input>
              <openwb-base-button-group-input
                v-model="powerLimit"
                title="Regellimit"
                :buttons="[
                  {
                    buttonValue: 'mode_no_discharge',
                    text: 'volle Entladesperre',
                  },
                  {
                    buttonValue: 'mode_discharge_home_consumption',
                    text: 'Entladung in Fahrzeuge sperren',
                  },
                  {
                    buttonValue: 'mode_charge_pv_production',
                    text: 'Speichervorrang',
                  },
                ]"
                :model-value="$store.state.mqtt['openWB/bat/config/power_limit_mode']"
                @update:model-value="updateState('openWB/bat/config/power_limit_mode', $event)"
              >
                <template #help>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_mode'] === 'mode_no_discharge'">
                    Die Speicherentladung wird komplett gesperrt! Alle Verbraucher
                    (Fahrzeuge, Hausverbrauch) werden durch Netzstrom und ggfs. vorhandenen PV-Überschuss versorgt.
                  </div>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_mode'] === 'mode_discharge_home_consumption'">
                    Die Speicherentladung in Fahrzeuge wird komplett gesperrt!
                    Fahrzeugladung die nicht durch PV-Überschuss gedeckt werden kann erzeugt Netzbezug statt Speicherentladung.
                    Weitere Verbraucher (bspw. Hausverbrauch) werden durch den Speicher ausgeglichen.
                    Kann die Entladung am Speicher nur komplett gesperrt werden, verhält sich diese Einstellung wie
                    "volle Entladesperre".            
                  </div>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_mode'] === 'mode_charge_pv_production'">
                    PV-Ertrag wird vorrangig in den Speicher geladen (aktive Ladung)! Weiterer Verbrauch
                    (Hausverbrauch/ Fahrzeugladung) erzeugt Netzbezug.
                  </div>
                </template>
              </openwb-base-button-group-input>
              <openwb-base-button-group-input
                title="Regelbedingung"
                :buttons="[
                  {
                    buttonValue: 'manual',
                    text: 'Manuell',
                  },
                  {
                    buttonValue: 'vehicle_charging',
                    text: 'Fahrzeuge laden',
                  },
                  {
                    buttonValue: 'price_limit',
                    text: 'Preisgrenze',
                  },
                ]"
                :model-value="$store.state.mqtt['openWB/bat/config/power_limit_condition']"
                @update:model-value="updateState('openWB/bat/config/power_limit_condition', $event)"
              >
                <template #help>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_condition'] === 'manual'">
                    Der Speicher regelt direkt entsprechend der manuellen Einstellung.
                  </div>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_condition'] === 'vehicle_charging'">
                    Das oben eingestellte Regellimit wird angewendet sobald ein oder mehrere Fahrzeuge Laden.         
                  </div>
                  <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_condition'] === 'price_limit'">
                    Regelung nach Preisgrenze bei variablen Strompreisen.
                  </div>
                </template>
              </openwb-base-button-group-input>
              <hr />
              <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_condition'] === 'manual'">
                <openwb-base-heading class="mt-0"> Manuell </openwb-base-heading>
                <openwb-base-button-group-input
                  title="Speichersteuerung"
                  :buttons="[
                    {
                      buttonValue: 'manual_disable',
                      text: 'Aus',
                    },
                    {
                      buttonValue: 'manual_limit',
                      text: 'Regellimit anwenden',
                    },
                    {
                      buttonValue: 'manual_charge',
                      text: 'Speicher laden',
                    },
                  ]"
                  :model-value="$store.state.mqtt['openWB/bat/config/manual_mode']"
                  @update:model-value="updateState('openWB/bat/config/manual_mode', $event)"
                >
                  <template #help>
                    <div v-if="$store.state.mqtt['openWB/bat/config/manual_mode'] === 'manual_disable'">
                      Aktive Speichersteuerung deaktivieren (Eigenregelung des Speichers).
                    </div>
                    <div v-if="$store.state.mqtt['openWB/bat/config/manual_mode'] === 'manual_limit'">
                      Es wird das weiter oben konfigurierte Regellimit angewendet.
                    </div>
                    <div v-if="$store.state.mqtt['openWB/bat/config/manual_mode'] === 'manual_charge'">
                      Alle Speicher werden mit ihrer eingestellten maximalen Ladeleistung beladen.
                      Befinden sich die Speicher über der oberen Ladeschranke wird der SoC gehalten.
                    </div>
                  </template>
                </openwb-base-button-group-input>
              </div>
              <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_condition'] === 'vehicle_charging'">
                <openwb-base-heading class="mt-0"> Fahrzeuge laden </openwb-base-heading>
                <openwb-base-alert subtype="info">
                  Dieser Modus bietet keine weiteren Einstellungen. Sobald mindestens ein Fahrzeug lädt
                  greift das weiter oben konfigurierte Regellimit.
                </openwb-base-alert>
              </div>
              <div v-if="$store.state.mqtt['openWB/bat/config/power_limit_condition'] === 'price_limit'">
                <openwb-base-heading class="mt-0"> Preisgrenze (Variable Strompreise) </openwb-base-heading>
                <openwb-base-button-group-input
                  title="Regellimit nach Preisgrenze anwenden"
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
                  :model-value="$store.state.mqtt['openWB/bat/config/price_limit_activated']"
                  @update:model-value="
                    updateState('openWB/bat/config/price_limit_activated', $event)
                  "
                >
                  <template #help>
                    Fällt der variable Strompreis unuter diesen Wert, greift das weiter oben konfigurierte Regellimit.
                  </template>
                </openwb-base-button-group-input>
                <openwb-base-number-input
                  title="Preisgrenze für Regellimit"
                  :step="0.001"
                  :precision="3"
                  unit="ct/kWh"
                  required
                  :model-value="$store.state.mqtt['openWB/bat/config/price_limit'] * 100000"
                  @update:model-value="updateState('openWB/bat/config/price_limit', parseFloat(($event / 100000).toFixed(7)))"
                />
                <openwb-base-button-group-input
                  title="Speicher nach Preisgrenze laden"
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
                  :model-value="$store.state.mqtt['openWB/bat/config/price_charge_activated']"
                  @update:model-value="
                    updateState('openWB/bat/config/price_charge_activated', $event)
                  "
                >
                  <template #help>
                    Fällt der variable Strompreis unter diesen Wert werden alle Speicher mit ihrer 
                    eingestellten maximalen Ladeleistung beladen.
                    Befinden sich die Speicher über der oberen Ladeschranke wird der SoC gehalten.
                  </template>
                </openwb-base-button-group-input>
                <openwb-base-number-input
                  title="Preisgrenze für Ladung"
                  :step="0.001"
                  :precision="3"
                  unit="ct/kWh"
                  required
                  :model-value="$store.state.mqtt['openWB/bat/config/charge_limit'] * 100000"
                  @update:model-value="updateState('openWB/bat/config/charge_limit', parseFloat(($event / 100000).toFixed(7)))"
                />
              </div>
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
        "openWB/bat/config/bat_control_activated",
        "openWB/bat/get/power_limit_controllable",
        "openWB/bat/+/get/max_charge_power",
        "openWB/bat/+/get/max_discharge_power",
        "openWB/bat/config/bat_control_min_soc",
        "openWB/bat/config/bat_control_max_soc",
        "openWB/bat/config/power_limit_mode",
        "openWB/bat/config/power_limit_condition",
        "openWB/bat/config/manual_mode",
        "openWB/bat/config/price_limit_activated",
        "openWB/bat/config/price_limit",
        "openWB/bat/config/price_charge_activated",
        "openWB/bat/config/charge_limit",
        "openWB/system/device/+/component/+/config",
        "openWB/bat/+/get/power_limit_controllable",
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
    numBatteriesInstalled: {
      get() {
        return Object.keys(this.batteryConfigs).length;
      },
    },
    batteryConfigs: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        return this.filterComponentsByType(this.getWildcardTopics("openWB/system/device/+/component/+/config"), "bat");
      },
    },
    controllableBatteryConfigs: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return {};
        }
        return this.filterControllableBatteries(this.getWildcardTopics("openWB/system/device/+/component/+/config"));
      },
    },
    containsNormalBatteries: {
      get() {
        if (this.$store.state.mqtt["openWB/general/extern"] === true) {
          return false;
        }
        return Object.keys(this.filterNormalBatteries(this.getWildcardTopics("openWB/system/device/+/component/+/config"))).length > 0;
      },
    },
  },
  methods: {
    getLimitControllable(id) {
      return this.$store.state.mqtt['openWB/bat/'+id+'/get/power_limit_controllable'];
    },
    filterComponentsByType(components, type) {
      return Object.keys(components)
        .filter((key) => {
          return components[key].type.includes(type);
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: components[key],
          };
        }, {});
    },
    filterControllableBatteries(components) {
      return Object.keys(components)
        .filter((key) => {
          return components[key].type.includes("bat") && components[key].configuration.power_limit_controllable === true;
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: components[key],
          };
        }, {});
    },
    filterNormalBatteries(components) {
      return Object.keys(components)
        .filter((key) => {
          return components[key].type.includes("bat") && this.getLimitControllable(components[key].id) === false;
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: components[key],
          };
        }, {});
    },
  },
};
</script>
