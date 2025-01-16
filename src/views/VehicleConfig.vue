<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showVehicleModal"
    title="Fahrzeug löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeVehicle(modalVehicleIndex, $event)"
  >
    Wollen Sie das Fahrzeug "{{ getVehicleName(modalVehicleIndex) }}" wirklich entfernen? Dieser Vorgang kann nicht
    rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showEvTemplateModal"
    title="Fahrzeug-Profil löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeEvTemplate(modalEvTemplateIndex, $event)"
  >
    Wollen Sie das Fahrzeug-Profil "{{ getEvTemplateName(modalEvTemplateIndex) }}" wirklich entfernen? Dieser Vorgang
    kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showChargeTemplateModal"
    title="Lade-Profil löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeChargeTemplate(modalChargeTemplateIndex, $event)"
  >
    Wollen Sie das Lade-Profil "{{ getChargeTemplateName(modalChargeTemplateIndex) }}" wirklich entfernen? Dieser
    Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showChargeTemplateSchedulePlanModal"
    title="Zielladen Zeitplan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="
      removeChargeTemplateSchedulePlan(modalChargeTemplateIndex, modalChargeTemplateSchedulePlanIndex, $event)
    "
  >
    Wollen Sie den Zielladen Zeitplan "{{
      getChargeTemplateSchedulePlanName(modalChargeTemplateIndex, modalChargeTemplateSchedulePlanIndex)
    }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showChargeTemplateTimeChargingPlanModal"
    title="Zeitladen Zeitplan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="
      removeChargeTemplateTimeChargingPlan(modalChargeTemplateIndex, modalChargeTemplateTimeChargingPlanIndex, $event)
    "
  >
    Wollen Sie den Zeitladen Zeitplan "{{
      getChargeTemplateTimeChargingPlanName(modalChargeTemplateIndex, modalChargeTemplateTimeChargingPlanIndex)
    }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <!-- main content -->
  <div class="vehicleConfig">
    <form name="vehicleConfigForm">
      <!-- vehicle card -->
      <openwb-base-card
        subtype="info"
        :collapsible="true"
        :collapsed="$route.params.section != 'vehicle'"
      >
        <template #header>
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'car']"
          />
          Fahrzeuge
        </template>
        <template #actions>
          <openwb-base-avatar
            v-if="$store.state.mqtt['openWB/general/extern'] === false"
            class="bg-success clickable"
            @click="addVehicle"
          >
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'plus']"
            />
          </openwb-base-avatar>
        </template>
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-card
            v-for="vehicleId in vehicleIndexes"
            :key="vehicleId"
            :title="getVehicleName(vehicleId)"
            :collapsible="true"
            :collapsed="!($route.params.section == 'vehicle' && parseInt($route.params.section_index) == vehicleId)"
            subtype="info"
          >
            <template
              v-if="vehicleId !== 0"
              #actions="slotProps"
            >
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeVehicleModal(vehicleId, $event)"
              >
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'trash']"
                />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/name']"
              :disabled="vehicleId === 0"
              @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/name', $event)"
            >
              <template
                v-if="vehicleId === 0"
                #help
              >
                Das Standard-Fahrzeug kann nicht umbenannt werden.
              </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              v-if="vehicleId !== 0"
              title="Fahrzeughersteller "
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/info'].manufacturer"
              @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/info', $event, 'manufacturer')"
            >
              <template #help> Optional: zusätzliche Information für den Systembericht. </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              v-if="vehicleId !== 0"
              title="Fahrzeugmodell"
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/info'].model"
              @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/info', $event, 'model')"
            >
              <template #help>
                Optional: zusätzliche Information für den Systembericht.<br />
                Nach Möglichkeit auch Angabe des Baujahres, da es durchaus beim Verhalten des Fahrzeugs Unterschiede
                geben kann.
              </template>
            </openwb-base-text-input>
            <openwb-base-alert subtype="info">
              Ein anderes Fahrzeug-Profil wird erst NACH dem Abstecken übernommen, da es sonst durch die Änderung
              bestimmter Einstellungen im laufenden Ladevorgang zu Widersprüchen kommen kann.
            </openwb-base-alert>
            <openwb-base-select-input
              title="Fahrzeug-Profil"
              :options="evTemplateList"
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/ev_template']"
              @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/ev_template', $event)"
            />
            <openwb-base-select-input
              title="Lade-Profil"
              :options="chargeTemplateList"
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/charge_template']"
              @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/charge_template', $event)"
            />
            <hr />
            <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true && !installAssistantActive">
              <openwb-base-array-input
                title="Zugeordnete ID-Tags"
                :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/tag_id']"
                @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/tag_id', $event)"
              />
              <openwb-base-alert subtype="info">
                Die hier eingetragenen ID-Tags dienen ausschließlich der Fahrzeugzuordnung.<br />
                <span v-html="$store.state.text.rfidWiki" />
              </openwb-base-alert>
              <hr />
            </div>
            <openwb-base-select-input
              class="mb-2"
              title="SoC-Modul des Fahrzeugs"
              :options="socModuleList"
              :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/config'].type"
              @update:model-value="updateSelectedSocModule(vehicleId, $event)"
            >
              <template #help>
                Mit einem SoC-Modul kann der Ladestand des Fahrzeugs ermittelt und geregelt werden. Z.B. lassen sich
                unabhängig vom Fahrzeug bestimmte SoC-Werte einstellen, um den Fahrzeugakku zu schonen. Aktuell werden
                die SoC-Werte mittels der App-Zugangsdaten aus dem Herstellerserver des Fahrzeuges ausgelesen. Zukünftig
                soll auch eine direkte SoC-Auslesung aus dem Fahrzeug möglich werden (openWB Pro).<br />
                Die SoC-Abfrage erfolgt automatisch beim Anstecken des Fahrzeuges und zusätzlich über einstellbare
                Abfrageintervalle während des Ladens und Nichtladens. Die Abfrage kann auch manuell durch Klick auf den
                Reload-Pfeil auf der Hauptseite ausgelöst werden.<br />
                Wenn eine Abfrage fehlschlägt, wird noch drei weitere Male im Abstand von 5 Minuten versucht, den SoC
                abzufragen. Wenn dies nicht erfolgreich ist, wird der SoC auf 0% gesetzt um zu vermeiden, dass ein Auto
                beim SoC-basierten Laden nicht geladen wird. Die Abfrage erfolgt dann wieder in den oben genannten
                Intervallen.<br />
                Da aktuell die SoC-Abfragen über Onlineserver der Fahrzeughersteller laufen, ist infolge möglicher
                Umstellungen/Wartungen keine 100%-ig sichere SoC-Abfrage garantiert. Auch kann es zu SoC-Abweichungen
                infolge von zeitlicher Verzögerungen kommen. Hilfestellung erfolgt primär im openWB-Forum.
              </template>
            </openwb-base-select-input>
            <div v-if="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/config'].type">
              <openwb-base-button-group-input
                title="SoC direkt aus Fahrzeug auslesen"
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
                  $store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/general_config'].use_soc_from_cp
                "
                @update:model-value="
                  updateState('openWB/vehicle/' + vehicleId + '/soc_module/general_config', $event, 'use_soc_from_cp')
                "
              >
                <template #help>
                  Wenn Ladepunkt und Fahrzeug das direkte Auslesen des SoCs über das Ladekabel unterstützen, wird der
                  SoC nach dem Anstecken aus dem Fahrzeug ausgelesen und während der Ladung berechnet. Das direkte
                  Auslesen des SoC aus dem Fahrzeug ist aktuell nur mit einer openWB Pro möglich.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-heading>
                Aktualisierung der Fahrzeugdaten
                <template #help>
                  Einige Hersteller begrenzen die möglichen Abfragen. Sobald ein gewisses Limit in einem Zeitraum
                  überschritten wird, werden weitere Anfragen blockiert. Die Zeitintervalle sollten daher nicht zu klein
                  gewählt werden.
                </template>
              </openwb-base-heading>
              <openwb-base-number-input
                title="Während der Ladung"
                unit="Min."
                :min="1"
                required
                :model-value="
                  $store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/general_config']
                    .request_interval_charging / 60
                "
                @update:model-value="
                  updateState(
                    'openWB/vehicle/' + vehicleId + '/soc_module/general_config',
                    $event * 60,
                    'request_interval_charging',
                  )
                "
              >
                <template #help>
                  Der Ladestand des Fahrzeugs (SoC) wird bei einem laufenden Ladevorgang in dem hier eingestellten
                  Intervall in Minuten abgefragt.
                </template>
              </openwb-base-number-input>
              <openwb-base-number-input
                title="Ohne laufende Ladung"
                unit="Min."
                :min="1"
                required
                :model-value="
                  $store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/general_config']
                    .request_interval_not_charging / 60
                "
                @update:model-value="
                  updateState(
                    'openWB/vehicle/' + vehicleId + '/soc_module/general_config',
                    $event * 60,
                    'request_interval_not_charging',
                  )
                "
              >
                <template #help>
                  Der Ladestand des Fahrzeugs (SoC) wird in dem hier eingestellten Intervall in Minuten abgefragt, falls
                  kein Ladevorgang aktiv ist.
                </template>
              </openwb-base-number-input>
              <openwb-base-button-group-input
                title="Nur aktualisieren wenn angesteckt"
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
                  $store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/general_config'].request_only_plugged
                "
                @update:model-value="
                  updateState(
                    'openWB/vehicle/' + vehicleId + '/soc_module/general_config',
                    $event,
                    'request_only_plugged',
                  )
                "
              >
                <template #help>
                  Wird hier "Ja" ausgewählt, dann wird der Ladestand des Fahrzeugs nur abgefragt, wenn das Ladekabel
                  angesteckt ist.
                </template>
              </openwb-base-button-group-input>
              <openwb-vehicle-proxy
                :vehicle-id="vehicleId"
                :vehicle="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/soc_module/config']"
                @update:configuration="
                  updateConfiguration('openWB/vehicle/' + vehicleId + '/soc_module/config', $event)
                "
              />
            </div>
          </openwb-base-card>
        </div>
      </openwb-base-card>
      <hr class="border-secondary" />
      <openwb-base-heading>Profile</openwb-base-heading>
      <!-- vehicle template card -->
      <openwb-base-card
        :collapsible="true"
        :collapsed="true"
      >
        <template #header>
          <font-awesome-layers
            fixed-width
            class="fa-lg"
          >
            <font-awesome-icon
              fixed-width
              :icon="['far', 'file']"
            />
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'car']"
              transform="shrink-8"
            />
          </font-awesome-layers>
          Fahrzeug-Profile
        </template>
        <template #actions>
          <openwb-base-avatar
            v-if="$store.state.mqtt['openWB/general/extern'] === false"
            class="bg-success clickable"
            @click="addEvTemplate"
          >
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'plus']"
            />
          </openwb-base-avatar>
        </template>
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-alert subtype="info">
            Ein anderes Fahrzeug-Profil wird erst
            <span class="text-uppercase font-weight-bold"> nach dem Abstecken </span>
            übernommen, da es sonst durch die Änderung bestimmter Einstellungen im laufenden Ladevorgang zu
            Widersprüchen kommen kann.
          </openwb-base-alert>
          <openwb-base-card
            v-for="(template, key) in evTemplates"
            :key="key"
            :title="template.name ? template.name : key"
            :collapsible="true"
            :collapsed="true"
          >
            <template
              v-if="!key.endsWith('/0')"
              #actions="slotProps"
            >
              <openwb-base-avatar
                v-if="$store.state.mqtt['openWB/general/extern'] === false && !slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeEvTemplateModal(key, $event)"
              >
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'trash']"
                />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              :model-value="template.name"
              :disabled="key.endsWith('/0')"
              @update:model-value="updateState(key, $event, 'name')"
            >
              <template
                v-if="key.endsWith('/0')"
                #help
              >
                Das Standard-Profil kann nicht umbenannt werden.
              </template>
            </openwb-base-text-input>
            <openwb-base-heading> Angaben zur Batterie </openwb-base-heading>
            <openwb-base-number-input
              title="Kapazität der Batterie"
              unit="kWh"
              :min="1"
              :step="1"
              required
              :model-value="template.battery_capacity / 1000"
              @update:model-value="updateState(key, $event * 1000, 'battery_capacity')"
            >
              <template #help>
                Angabe der Netto-Kapazität der Fahrzeugbatterie. Dient zur Berechnung des manuellen SoC und der
                geladenen Reichweite. Die Netto-Kapazität unterscheidet sich meist von den Angaben der
                Fahrzeughersteller. So besitzt ein Tesla Model S 90 z. B. nur ca. 83kWh und nicht die durch die
                Typenbezeichnung suggerierten 90kWh. Andere Hersteller begrenzen die nutzbare Kapazität absichtlich, um
                eine höhere Lebensdauer der Akkus zu erreichen. Gängig sind eine Drosselung auf 90% der angegebenen
                Brutto-Kapazität.
              </template>
            </openwb-base-number-input>
            <div v-if="!installAssistantActive">
              <openwb-base-number-input
                title="Wirkungsgrad der Ladeelektronik"
                unit="%"
                :min="1"
                :max="100"
                required
                :model-value="template.efficiency"
                @update:model-value="updateState(key, $event, 'efficiency')"
              >
                <template #help>
                  Durch Verluste in der Ladeelektronik (z. B. Umwandlung Wechselspannung in Gleichspannung) gelangt
                  nicht die komplette Energie, welche durch den Zähler in der Wallbox gemessen wird, in den Akku des
                  Fahrzeugs. Der anzugebende Wert liegt bei gängigen Fahrzeugen im Bereich 90-95%. Eine Ausnahme stellt
                  der Zoe dar, dessen Chameleon-Lader je nach Modellversion und freigegebener Leistung der Wallbox
                  teilweise nur auf ca. 50% kommt.<br />
                  Liegen die Angaben der Wallbox und des Fahrzeugs nach der Ladung mehrere Prozent auseinander, dann
                  kann mit dieser Einstellung eine Feinabstimmung erfolgen:
                  <br />
                  SoC an der Wallbox zu hoch: Wirkungsgrad um ein paar Prozent reduzieren<br />
                  SoC an der Wallbox zu gering: Wirkungsgrad um ein paar Prozent erhöhen<br />
                </template>
              </openwb-base-number-input>
            </div>
            <openwb-base-number-input
              title="Durchschnittsverbrauch"
              unit="kWh&nbsp;/&nbsp;100km"
              :min="1"
              :step="0.1"
              required
              :model-value="template.average_consump / 1000"
              @update:model-value="updateState(key, $event * 1000, 'average_consump')"
            />
            <div v-if="dcChargingEnabled === true">
              <openwb-base-heading> Angaben zur Ladeleistung (DC) </openwb-base-heading>
              <openwb-base-number-input
                title="Mindestleistung"
                :min="5"
                unit="kW"
                :model-value="ac_current2dc_power(template.dc_min_current)"
                @update:model-value="updateState(key, dc_power2ac_current($event), 'dc_min_current')"
              />
              <openwb-base-number-input
                title="Maximalleistung"
                unit="kW"
                :model-value="ac_current2dc_power(template.dc_max_current)"
                @update:model-value="updateState(key, dc_power2ac_current($event), 'dc_max_current')"
              />
            </div>
            <openwb-base-heading>
              Angaben zum Ladestrom
              <span v-if="dcChargingEnabled === true"> (AC) </span>
            </openwb-base-heading>
            <openwb-base-range-input
              title="Mindeststrom"
              :min="6"
              :max="16"
              :step="1"
              unit="A"
              :model-value="template.min_current"
              @update:model-value="updateState(key, $event, 'min_current')"
            />
            <openwb-base-range-input
              title="Maximalstrom bei einer Phase"
              :min="6"
              :max="32"
              :step="1"
              unit="A"
              :model-value="template.max_current_single_phase"
              @update:model-value="updateState(key, $event, 'max_current_single_phase')"
            />
            <openwb-base-range-input
              title="Maximalstrom mehrere Phasen"
              :min="6"
              :max="32"
              :step="1"
              unit="A"
              :model-value="template.max_current_multi_phases"
              @update:model-value="updateState(key, $event, 'max_current_multi_phases')"
            />
            <openwb-base-number-input
              title="Erlaubte Stromabweichung"
              :step="0.1"
              unit="A"
              :model-value="template.nominal_difference"
              @update:model-value="updateState(key, $event, 'nominal_difference')"
            >
              <template #help>
                In manchen Lademodi, z.B. bei der automatischen Phasenumschaltung, wird geprüft, ob das Fahrzeug mit der
                vorgegebenen Stromstärke lädt. Manche Fahrzeuge laden nicht exakt mit der vorgegebenen Stromstärke. Die
                erlaubte Abweichung kann hier eingestellt werden.
              </template>
            </openwb-base-number-input>
            <openwb-base-heading>
              Angaben zur Handhabung von Phasen
              <span v-if="dcChargingEnabled === true"> (AC) </span>
            </openwb-base-heading>
            <openwb-base-button-group-input
              title="Unterstützte Phasen"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 2, text: '2' },
                { buttonValue: 3, text: '3' },
              ]"
              :model-value="template.max_phases"
              @update:model-value="updateState(key, $event, 'max_phases')"
            >
              <template #help>
                Anzahl der Phasen, die der Fahrzeuglader (s.g. OBC - OnboardCharger) bereitstellt. Plugin-Hybride haben
                meist nur eine Phase, reine E-Autos meist 2 bis 3 Phasen.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="CP-Unterbrechung"
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
              :model-value="template.control_pilot_interruption"
              @update:model-value="updateState(key, $event, 'control_pilot_interruption')"
            >
              <template #help> Erläuterung siehe "Konfiguration - Ladepunkte" -> Hardware-Optionen </template>
            </openwb-base-button-group-input>
            <openwb-base-number-input
              v-if="template.control_pilot_interruption"
              title="Dauer der CP-Unterbrechung"
              :min="4"
              :step="1"
              unit="s"
              :model-value="template.control_pilot_interruption_duration"
              @update:model-value="updateState(key, $event, 'control_pilot_interruption_duration')"
            />
            <openwb-base-button-group-input
              title="Phasenumschaltung blockieren"
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
              :model-value="template.prevent_phase_switch"
              @update:model-value="updateState(key, $event, 'prevent_phase_switch')"
            >
              <template #help> Erläuterung zu 1p3p siehe "Ladeeinstellungen" </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Ladung aktiv halten"
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
              :model-value="template.prevent_charge_stop"
              @update:model-value="updateState(key, $event, 'prevent_charge_stop')"
            >
              <template #help>
                Der Ladevorgang wird in den Lademodi PV- und Zielladen nach Ladebeginn nicht unterbrochen, selbst wenn
                nicht mehr genug Überschuss vorhanden ist. Diese Einstellung sollte bei Fahrzeugen aktiviert werden, die
                nach einer Ladungsunterbrechung keine Ladung mehr starten.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-number-input
              title="Pause bei Phasenumschaltung"
              unit="s"
              :min="2"
              :step="1"
              required
              :model-value="template.phase_switch_pause"
              @update:model-value="updateState(key, $event, 'phase_switch_pause')"
            />
            <div v-if="!installAssistantActive">
              <openwb-base-number-input
                title="Mindestzeit zwischen Umschaltungen"
                unit="s"
                :min="2"
                :step="1"
                required
                :model-value="template.keep_charge_active_duration"
                @update:model-value="updateState(key, $event, 'keep_charge_active_duration')"
              >
                <template #help>
                  Manche Fahrzeuge benötigen nach der Umschaltung einige Zeit, bis sie mit der vorgegebenen Phasenzahl
                  laden. In dieser Zeit wird keine neue Phasenumschaltung angestoßen.
                </template>
              </openwb-base-number-input>
            </div>
          </openwb-base-card>
        </div>
      </openwb-base-card>
      <!-- charge template card -->
      <openwb-base-card
        :collapsible="true"
        :collapsed="$route.params.section != 'charge_template'"
      >
        <template #header>
          <font-awesome-layers
            fixed-width
            class="fa-lg"
          >
            <font-awesome-icon
              fixed-width
              :icon="['far', 'file']"
            />
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'plug']"
              transform="shrink-8"
            />
          </font-awesome-layers>
          Lade-Profile
        </template>
        <template #actions>
          <openwb-base-avatar
            v-if="$store.state.mqtt['openWB/general/extern'] === false"
            class="bg-success clickable"
            @click="addChargeTemplate"
          >
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'plus']"
            />
          </openwb-base-avatar>
        </template>
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-card
            v-for="(template, templateKey) in chargeTemplates"
            :key="templateKey"
            :title="template.name ? template.name : templateKey"
            :collapsible="true"
            :collapsed="
              !(
                $route.params.section == 'charge_template' &&
                parseInt($route.params.section_index) == getChargeTemplateIndex(templateKey)
              )
            "
          >
            <template
              v-if="!templateKey.endsWith('/0')"
              #actions="slotProps"
            >
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeChargeTemplateModal(templateKey, $event)"
              >
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'trash']"
                />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              :model-value="template.name"
              :disabled="templateKey.endsWith('/0')"
              @update:model-value="updateState(templateKey, $event, 'name')"
            >
              <template
                v-if="templateKey.endsWith('/0')"
                #help
              >
                Das Standard-Profil kann nicht umbenannt werden.
              </template>
            </openwb-base-text-input>
            <openwb-base-heading> Allgemeine Optionen </openwb-base-heading>
            <openwb-base-button-group-input
              title="Aktiver Lademodus"
              :buttons="[
                {
                  buttonValue: 'instant_charging',
                  text: 'Sofortladen',
                  class: 'btn-outline-danger',
                },
                {
                  buttonValue: 'pv_charging',
                  text: 'PV',
                  class: 'btn-outline-success',
                },
                {
                  buttonValue: 'scheduled_charging',
                  text: 'Zielladen',
                  class: 'btn-outline-primary',
                },
                {
                  buttonValue: 'eco',
                  text: 'Eco',
                  class: 'btn-outline-secondary',
                },
                {
                  buttonValue: 'stop',
                  text: 'Stop',
                  class: 'btn-outline-dark',
                },
              ]"
              :model-value="template.chargemode.selected"
              @update:model-value="updateState(templateKey, $event, 'chargemode.selected')"
            >
              <template #help>
                Diese Einstellung entspricht dem gewählten Lademodus auf der Hauptseite und ist aktiv, wenn ein
                zugehöriges Fahrzeug angesteckt ist.<br />
                Die zur Verfügung stehende Leistung wird intern anhand folgender Prioritätenliste auf die Fahrzeuge bzw.
                Ladepunkte verteilt:<br />
                <ol>
                  <li>Zielladen (Sofortladen) mit Priorität</li>
                  <li>Zielladen (Sofortladen)</li>
                  <li>Zeitladen mit Priorität</li>
                  <li>Zeitladen</li>
                  <li>Sofortladen mit Priorität</li>
                  <li>Sofortladen</li>
                  <li>PV (Min-Anteil) mit Priorität</li>
                  <li>PV (Min-Anteil)</li>
                  <li>Zielladen (PV) mit Priorität</li>
                  <li>Zielladen (PV)</li>
                  <li>PV (PV-Anteil) mit Priorität</li>
                  <li>PV (PV-Anteil)</li>
                </ol>
              </template>
            </openwb-base-button-group-input>
            <div v-if="!installAssistantActive">
              <openwb-base-button-group-input
                title="Priorität"
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
                :model-value="template.prio"
                @update:model-value="updateState(templateKey, $event, 'prio')"
              >
                <template #help>
                  Die Ladefreigabe mit dem jeweils eingestellten Mindeststrom erfolgt für alle Fahrzeuge, soweit die
                  verfügbare Leistung ausreicht. Fahrzeuge mit Priorität werden bevorzugt mit mehr Leistung geladen,
                  falls verfügbar. Erst wenn alle priorisierten Fahrzeuge die maximale Ladeleistung bekommen und noch
                  zusätzlicher Überschuss vorhanden ist, wird auch für Fahrzeuge ohne Priorität mehr Leistung
                  freigegeben.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-button-group-input
                title="Zeitladen"
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
                :model-value="template.time_charging.active"
                @update:model-value="updateState(templateKey, $event, 'time_charging.active')"
              >
                <template #help>
                  Der Lademodus Zeitladen kann parallel zu einem der anderen Lademodi aktiviert werden. Die Auswahl des
                  Lademodus, der in der Regelung genutzt wird, erfolgt anhand der Übersicht in der Hilfe bei "Aktiver
                  Lademodus". Wenn kein Zeitplan aktiv ist oder das Limit des Zeitplans erreicht wurde, wird der
                  Lademodus verwendet, der bei "Aktiver Lademodus" ausgewählt ist.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-button-group-input
                title="Standard nach Abstecken"
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
                :model-value="template.load_default"
                @update:model-value="updateState(templateKey, $event, 'load_default')"
              >
                <template #help>
                  Falls diese Option aktiviert ist, wird der betroffene Ladepunkt nach dem Abstecken auf das Standard
                  Fahrzeug zurückgesetzt.
                </template>
              </openwb-base-button-group-input>
              <hr />
            </div>
            <openwb-base-heading>Sofortladen</openwb-base-heading>
            <openwb-base-range-input
              :title="'Soll-Ladestrom' + (dcChargingEnabled ? ' (AC)' : '')"
              :min="6"
              :max="32"
              :step="1"
              unit="A"
              :model-value="template.chargemode.instant_charging.current"
              @update:model-value="updateState(templateKey, $event, 'chargemode.instant_charging.current')"
            />
            <openwb-base-number-input
              v-if="dcChargingEnabled === true"
              title="Soll-Ladeleistung (DC)"
              unit="kW"
              :min="0"
              :model-value="ac_current2dc_power(template.chargemode.instant_charging.dc_current)"
              @update:model-value="
                updateState(templateKey, dc_power2ac_current($event), 'chargemode.instant_charging.dc_current')
              "
            />
            <openwb-base-button-group-input
              title="Anzahl Phasen"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 3, text: 'Maximum' },
              ]"
              :model-value="template.chargemode.instant_charging.phases_to_use"
              @update:model-value="updateState(templateKey, $event, 'chargemode.instant_charging.phases_to_use')"
            >
              <template #help>
                Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in Abhängigkeit
                der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Voraussetzung ist die verbaute
                Umschaltmöglichkeit zwischen 1- und 3-phasig (s.g. 1p3p).
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Begrenzung"
              :buttons="[
                {
                  buttonValue: 'none',
                  text: 'Aus',
                },
                {
                  buttonValue: 'soc',
                  text: 'Fahrzeug-SoC',
                },
                {
                  buttonValue: 'amount',
                  text: 'Energie',
                },
              ]"
              :model-value="template.chargemode.instant_charging.limit.selected"
              @update:model-value="updateState(templateKey, $event, 'chargemode.instant_charging.limit.selected')"
            >
              <template #help>
                Sofortladen kann ohne Fahrzeug-SoC-Begrenzung (Aus), mit Begrenzung des Fahrzeug-SoC (SoC) bei
                konfiguriertem SoC-Auslesemodul oder mittels Vorgabe eine gewünschten Energiemenge in kWh (Energie)
                genutzt werden.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-range-input
              title="SoC-Limit für das Fahrzeug"
              :min="5"
              :max="100"
              :step="5"
              unit="%"
              :model-value="template.chargemode.instant_charging.limit.soc"
              @update:model-value="updateState(templateKey, $event, 'chargemode.instant_charging.limit.soc')"
            >
              <template #help>
                Um die Fahrzeug-SoC-Begrenzung nutzen zu können, muss ein SoC-Modul für das jeweilige Fahrzeug
                eingerichtet sein (siehe "Konfiguration" -> "Fahrzeuge" -> "SoC-Modul").
              </template>
            </openwb-base-range-input>
            <openwb-base-number-input
              title="Energie-Limit"
              unit="kWh"
              :min="1"
              :step="1"
              :model-value="template.chargemode.instant_charging.limit.amount / 1000"
              @update:model-value="updateState(templateKey, $event * 1000, 'chargemode.instant_charging.limit.amount')"
            >
              <template #help>
                Die geladene Energiemenge wird beim Wechsel des Lademodus oder nach dem Anstecken, wenn Sofortladen
                schon ausgewählt ist, neu gezählt.
              </template>
            </openwb-base-number-input>
            <hr />
            <openwb-base-heading>PV-Laden</openwb-base-heading>
            <openwb-base-range-input
              :title="'Minimaler Dauerstrom' + (dcChargingEnabled ? ' (AC)' : '')"
              :min="0"
              :max="11"
              :step="1"
              unit="A"
              :labels="[
                { label: 'Aus', value: 0 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
              ]"
              :model-value="template.chargemode.pv_charging.min_current"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.min_current')"
            >
              <template #help>
                Hier kann eine Stromstärke eingestellt werden, mit dem unabhängig vom vorhandenen Überschuss
                durchgeladen wird. Hierdurch wird z.B. an Tagen mit häufigem Sonne/Wolken-Wechsel oder mit nur wenig
                PV-Ertrag ein Laden ohne Unterbrechung ermöglicht. Folglich kann auch Netzbezug für das Fahrzeugladen
                entstehen, weshalb der niedrigste Stromwert empfohlen wird. Diese Einstellung entspricht weitestgehend
                dem Lademodus "Min+PV" der Version 1.x.
              </template>
            </openwb-base-range-input>
            <openwb-base-number-input
              v-if="dcChargingEnabled === true"
              title="Minimale Dauerleistung (DC)"
              unit="kW"
              :min="0"
              :model-value="ac_current2dc_power(template.chargemode.pv_charging.dc_min_current)"
              @update:model-value="
                updateState(templateKey, dc_power2ac_current($event), 'chargemode.pv_charging.dc_min_current')
              "
            >
              <template #help>
                Hier kann eine Leistung eingestellt werden, mit dem unabhängig vom vorhandenen Überschuss durchgeladen
                wird. Hierdurch wird z.B. an Tagen mit häufigem Sonne/Wolken-Wechsel oder mit nur wenig PV-Ertrag ein
                Laden ohne Unterbrechung ermöglicht. Folglich kann auch Netzbezug für das Fahrzeugladen entstehen,
                weshalb der niedrigste Leistungswert empfohlen wird.
              </template>
            </openwb-base-number-input>
            <openwb-base-button-group-input
              title="Anzahl Phasen"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 3, text: 'Maximum' },
                { buttonValue: 0, text: 'Automatik' },
              ]"
              :model-value="template.chargemode.pv_charging.phases_to_use"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.phases_to_use')"
            >
              <template #help>
                Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in Abhängigkeit
                der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus "Automatik" entscheidet die
                Regelung, welche Einstellung genutzt wird, um den verfügbaren Überschuss in die Fahrzeuge zu laden.
                Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen einer und mehreren Phasen (sog. 1p3p).
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Begrenzung"
              :buttons="[
                {
                  buttonValue: 'none',
                  text: 'Aus',
                },
                {
                  buttonValue: 'soc',
                  text: 'Fahrzeug-SoC',
                },
                {
                  buttonValue: 'amount',
                  text: 'Energie',
                },
              ]"
              :model-value="template.chargemode.pv_charging.limit.selected"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.limit.selected')"
            >
              <template #help>
                Sofortladen kann ohne Fahrzeug-SoC-Begrenzung (Aus), mit Begrenzung des Fahrzeug-SoC (SoC) bei
                konfiguriertem SoC-Auslesemodul oder mittels Vorgabe eine gewünschten Energiemenge in kWh (Energie)
                genutzt werden.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-range-input
              title="SoC-Limit für das Fahrzeug"
              :min="5"
              :max="100"
              :step="5"
              unit="%"
              :model-value="template.chargemode.pv_charging.limit.soc"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.limit.soc')"
            >
              <template #help>
                Um die Fahrzeug-SoC-Begrenzung nutzen zu können, muss ein SoC-Modul für das jeweilige Fahrzeug
                eingerichtet sein (siehe "Konfiguration" -> "Fahrzeuge" -> "SoC-Modul").
              </template>
            </openwb-base-range-input>
            <openwb-base-number-input
              title="Energie-Limit"
              unit="kWh"
              :min="1"
              :step="1"
              :model-value="template.chargemode.pv_charging.limit.amount / 1000"
              @update:model-value="updateState(templateKey, $event * 1000, 'chargemode.pv_charging.limit.amount')"
            >
              <template #help>
                Die geladene Energiemenge wird beim Wechsel des Lademodus oder nach dem Anstecken, wenn Sofortladen
                schon ausgewählt ist, neu gezählt.
              </template>
            </openwb-base-number-input>
            <openwb-base-range-input
              title="Mindest-SoC für das Fahrzeug"
              :min="0"
              :max="19"
              :step="1"
              unit="%"
              :labels="[
                { label: 'Aus', value: 0 },
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 15, value: 15 },
                { label: 20, value: 20 },
                { label: 25, value: 25 },
                { label: 30, value: 30 },
                { label: 35, value: 35 },
                { label: 40, value: 40 },
                { label: 45, value: 45 },
                { label: 50, value: 50 },
                { label: 55, value: 55 },
                { label: 60, value: 60 },
                { label: 65, value: 65 },
                { label: 70, value: 70 },
                { label: 75, value: 75 },
                { label: 80, value: 80 },
                { label: 85, value: 85 },
                { label: 90, value: 90 },
                { label: 95, value: 95 },
              ]"
              :model-value="template.chargemode.pv_charging.min_soc"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.min_soc')"
            >
              <template #help>
                Liegt der Fahrzeug-Ladestand (SoC) unter dem hier eingestellten Wert, dann wird bis zum Erreichen dieses
                Wertes mit dem eingestellten "Mindest-SoC-Strom" geladen. Dies dient der Sicherstellung eines
                "Mindest-SoC" - z.B. für eine immer abzudeckende Fahrzeugreichweite - auch wenn kein oder zu wenig
                Überschuss verfügbar ist (=> Laden mit anteilig Netzstrom). Nach dem Erreichen des "Mindest-SoC" wird
                bei verfügbarem Überschuss geladen.<br />
                Um die Fahrzeug-SoC-Begrenzung nutzen zu können, muss ein SoC-Modul für das jeweilige Fahrzeug
                eingerichtet sein (siehe "Konfiguration" -> "Fahrzeuge" -> "SoC-Modul").
              </template>
            </openwb-base-range-input>
            <openwb-base-range-input
              :title="'Mindest-SoC-Strom' + (dcChargingEnabled ? ' (AC)' : '')"
              :min="6"
              :max="32"
              :step="1"
              unit="A"
              :model-value="template.chargemode.pv_charging.min_soc_current"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.min_soc_current')"
            >
              <template #help>
                Wird der oben eingestellte "Mindest-SoC" des Fahrzeuges unterschritten, dann wird unabhängig vom
                Überschuss ein Ladevorgang mit dem hier festgelegten "Mindest-SoC-Strom" initiiert (ggf. mit anteilig
                Netzbezug).
              </template>
            </openwb-base-range-input>
            <openwb-base-number-input
              v-if="dcChargingEnabled === true"
              title="Mindest-SoC-Leistung (DC)"
              unit="kW"
              :min="0"
              :model-value="ac_current2dc_power(template.chargemode.pv_charging.dc_min_soc_current)"
              @update:model-value="
                updateState(templateKey, dc_power2ac_current($event), 'chargemode.pv_charging.dc_min_soc_current')
              "
            >
              <template #help>
                Wird der oben eingestellte "Mindest-SoC" des Fahrzeuges unterschritten, dann wird unabhängig vom
                Überschuss ein Ladevorgang mit der hier festgelegten "Mindest-SoC-Leistung" initiiert (ggf. mit anteilig
                Netzbezug).
              </template>
            </openwb-base-number-input>
            <openwb-base-button-group-input
              title="Anzahl Phasen Mindest-SoC"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 3, text: 'Maximum' },
              ]"
              :model-value="template.chargemode.pv_charging.phases_to_use_min_soc"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.phases_to_use_min_soc')"
            >
              <template #help>
                Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in Abhängigkeit
                der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Voraussetzung ist die verbaute
                Umschaltmöglichkeit zwischen einer und mehreren Phasen (sog. 1p3p).
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Einspeisegrenze beachten"
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
              :model-value="template.chargemode.pv_charging.feed_in_limit"
              @update:model-value="updateState(templateKey, $event, 'chargemode.pv_charging.feed_in_limit')"
            >
              <template #help>
                Erläuterung siehe "Ladeeinstellungen" -> "PV-Laden" -> "Regelparameter" -> "Regelpunkt Einspeisegrenze"
              </template>
            </openwb-base-button-group-input>
            <hr />
            <openwb-base-heading>
              Zielladen
              <template #actions>
                <openwb-base-avatar
                  class="bg-success clickable"
                  @click="addChargeTemplateSchedulePlan(templateKey, $event)"
                >
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'plus']"
                  />
                </openwb-base-avatar>
              </template>
              <template #help>
                Im Lademodus "Zielladen" wird der Ladestrom so angepasst, dass das Fahrzeug zum angegebenen Zeitpunkt
                den eingestellten SoC bzw. die einzuladende Energiemenge erreicht. Anhand des vorgegebenen Ladestroms
                wird der Zeitpunkt berechnet, an dem die Ladung spätestens starten muss.<br />
                Ist der berechnete Zeitpunkt des Ladestarts noch nicht erreicht, wird mit Überschuss geladen. Auch nach
                Erreichen des Ziel-SoCs wird mit Überschuss geladen, solange bis das "SoC-Limit für das Fahrzeug"
                erreicht wird.<br />
                Kann der Ziel-SoC bzw. die Energiemenge NICHT erreicht werden, z.B. weil das Auto zu spät angesteckt
                wurde oder das Lastmanagement eingegriffen hat, wird bis 20 Minuten nach dem angegebenen Termin mit der
                Maximalstromstärke geladen. Danach wird der Termin verworfen und mit Überschuss geladen.
              </template>
            </openwb-base-heading>
            <openwb-base-card
              v-for="(plan, planKey) in getChargeTemplateScheduledChargingPlans(templateKey)"
              :key="planKey"
              :title="plan.name"
              :collapsible="true"
              :collapsed="true"
            >
              <template #actions="slotProps">
                <span
                  v-if="slotProps.collapsed == true"
                  class="subheader pill clickable"
                  :class="plan.active ? 'bg-success' : 'bg-danger'"
                  @click.stop="updateState(planKey, !plan.active, 'active')"
                >
                  <span v-if="plan.limit.selected == 'soc'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'car-battery']"
                    />
                    {{ plan.limit.soc_scheduled }}%
                  </span>
                  <span v-if="plan.limit.selected == 'amount'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'bolt']"
                    />
                    {{ plan.limit.amount / 1000 }}kWh
                  </span>
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'clock']"
                  />
                  {{ plan.time }}
                  <span v-if="plan.frequency.selected == 'once'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-day']"
                    />
                    {{ formatDate(plan.frequency.once) }}
                  </span>
                  <span v-if="plan.frequency.selected == 'daily'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-week']"
                    />
                  </span>
                  <span v-if="plan.frequency.selected == 'weekly'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-alt']"
                    />
                  </span>
                </span>
                <openwb-base-avatar
                  v-if="slotProps.collapsed == false"
                  class="bg-danger clickable"
                  @click="removeChargeTemplateSchedulePlanModal(templateKey, planKey, $event)"
                >
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'trash']"
                  />
                </openwb-base-avatar>
              </template>
              <openwb-base-text-input
                title="Bezeichnung"
                :model-value="plan.name"
                @update:model-value="updateState(planKey, $event, 'name')"
              />
              <openwb-base-button-group-input
                title="Zeitpunkt aktiv"
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
                :model-value="plan.active"
                @update:model-value="updateState(planKey, $event, 'active')"
              />
              <openwb-base-text-input
                title="Ziel-Uhrzeit"
                subtype="time"
                :model-value="plan.time"
                @update:model-value="updateState(planKey, $event, 'time')"
              >
                <template #help>
                  Hier ist die gewünschte Uhrzeit einzustellen, zu welcher das Fahrzeug den gewünschten SoC bzw. die zu
                  ladende Energiemenge BEREITS ERREICHT haben soll.
                </template>
              </openwb-base-text-input>
              <openwb-base-range-input
                :title="'Ladestrom' + (dcChargingEnabled ? ' (AC)' : '')"
                :min="6"
                :max="32"
                :step="1"
                unit="A"
                :model-value="plan.current"
                @update:model-value="updateState(planKey, $event, 'current')"
              >
                <template #help>
                  Mit dieser Stromstärke wird der Zeitpunkt berechnet, wann die Ladung mit Netzbezug gestartet werden
                  muss. Wird der Ziel-SoC nicht zum angegebenen Termin erreicht, weil z.B. das Auto erst später
                  angesteckt wurde, wird auch mit einer höheren Stromstärke geladen. Um etwas Puffer zu haben, empfiehlt
                  es sich, etwas weniger als die Maximalstromstärke des Fahrzeugs zu wählen.
                </template>
              </openwb-base-range-input>
              <openwb-base-number-input
                v-if="dcChargingEnabled === true"
                title="Ladeleistung (DC)"
                unit="kW"
                :min="0"
                :model-value="ac_current2dc_power(plan.dc_current)"
                @update:model-value="updateState(planKey, dc_power2ac_current($event), 'dc_current')"
              />
              <openwb-base-button-group-input
                title="Ziel"
                :buttons="[
                  {
                    buttonValue: 'soc',
                    text: 'Fahrzeug-SoC',
                  },
                  {
                    buttonValue: 'amount',
                    text: 'Energie',
                  },
                ]"
                :model-value="plan.limit.selected"
                @update:model-value="updateState(planKey, $event, 'limit.selected')"
              >
                <template #help> Bestimmt die Art der Grenze für den Ladevorgang. </template>
              </openwb-base-button-group-input>
              <openwb-base-range-input
                v-if="plan.limit.selected == 'soc'"
                title="Fahrzeug-SoC zum Zielzeitpunkt"
                :min="5"
                :max="100"
                :step="5"
                unit="%"
                :model-value="plan.limit.soc_scheduled"
                @update:model-value="updateState(planKey, $event, 'limit.soc_scheduled')"
              >
                <template #help> SoC, der zum angegebenen Zeitpunkt erreicht werden soll (Ziel-SoC). </template>
              </openwb-base-range-input>
              <openwb-base-range-input
                v-if="plan.limit.selected == 'soc'"
                title="Fahrzeug-SoC mit Überschuss"
                :min="5"
                :max="100"
                :step="5"
                unit="%"
                :model-value="plan.limit.soc_limit"
                @update:model-value="updateState(planKey, $event, 'limit.soc_limit')"
              >
                <template #help>
                  Nach Erreichen des Ziel-SoCs wird mit Überschuss weiter geladen, bis das SoC-Limit erreicht wird.
                  Sobald das SoC-Limit erreicht wurde, findet keine Ladung mehr mit Überschuss statt!
                </template>
              </openwb-base-range-input>
              <openwb-base-number-input
                v-if="plan.limit.selected == 'amount'"
                title="Ziel-Energie"
                unit="kWh"
                :min="1"
                :step="0.5"
                :model-value="plan.limit.amount / 1000"
                @update:model-value="updateState(planKey, $event * 1000, 'limit.amount')"
              >
                <template #help>
                  Die geladene Energiemenge wird beim Wechsel des Lademodus, Wechsel des Plans oder nach dem Anstecken,
                  wenn Zielladen schon ausgewählt ist, neu gezählt.
                </template>
              </openwb-base-number-input>
              <openwb-base-button-group-input
                title="Wiederholungen"
                :buttons="[
                  {
                    buttonValue: 'once',
                    text: 'Einmalig',
                    class: 'btn-outline-info',
                  },
                  {
                    buttonValue: 'daily',
                    text: 'Täglich',
                    class: 'btn-outline-info',
                  },
                  {
                    buttonValue: 'weekly',
                    text: 'Wöchentlich',
                    class: 'btn-outline-info',
                  },
                ]"
                :model-value="plan.frequency.selected"
                @update:model-value="updateState(planKey, $event, 'frequency.selected')"
              />
              <openwb-base-text-input
                v-if="plan.frequency.selected == 'once'"
                title="Datum"
                subtype="date"
                :model-value="plan.frequency.once"
                @update:model-value="updateState(planKey, $event, 'frequency.once')"
              />
              <div v-if="plan.frequency.selected == 'weekly'">
                <openwb-base-button-group-input
                  v-for="(day, dayIndex) in weekdays"
                  :key="dayIndex"
                  :title="day"
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
                  :model-value="plan.frequency.weekly[dayIndex]"
                  @update:model-value="updateState(planKey, $event, 'frequency.weekly.' + dayIndex)"
                />
              </div>
              <openwb-base-button-group-input
                title="Strompreisbasiert Laden"
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
                :model-value="plan.et_active"
                @update:model-value="updateState(planKey, $event, 'et_active')"
              />
              <div v-if="template.et_active == true">
                <div
                  v-if="
                    !$store.state.mqtt['openWB/optional/et/provider'] ||
                    !$store.state.mqtt['openWB/optional/et/provider'].type
                  "
                >
                  <openwb-base-alert subtype="danger">
                    Bitte in den übergreifenden Ladeeinstellungen einen Strompreis-Anbieter konfigurieren.
                  </openwb-base-alert>
                </div>
              </div>
              <openwb-base-button-group-input
                title="Anzahl Phasen Zielladen"
                :buttons="[
                  { buttonValue: 1, text: '1' },
                  { buttonValue: 3, text: 'Maximum' },
                  { buttonValue: 0, text: 'Automatik' },
                ]"
                :model-value="plan.phases_to_use"
                @update:model-value="updateState(planKey, $event, 'phases_to_use')"
              >
                <template #help>
                  Hier kann eingestellt werden, ob Ladevorgänge im Modus "Zielladen" mit nur einer Phase oder dem möglichen
                  Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus
                  "Automatik" entscheidet die Regelung, welche Einstellung genutzt wird, um das Ziel zu erreichen.
                  Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (sog. 1p3p).
                </template>
              </openwb-base-button-group-input>
              <openwb-base-button-group-input
                title="Anzahl Phasen bei PV-Überschuss"
                :buttons="[
                  { buttonValue: 1, text: '1' },
                  { buttonValue: 3, text: 'Maximum' },
                  { buttonValue: 0, text: 'Automatik' },
                ]"
                :model-value="plan.phases_to_use_pv"
                @update:model-value="updateState(planKey, $event, 'phases_to_use_pv')"
              >
                <template #help>
                  Hier kann eingestellt werden, ob Ladevorgänge im Modus "Zielladen" bei Laden mit PV-Überschuss mit nur
                  einer Phase oder dem möglichen Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen
                  durchgeführt werden. Im Modus "Automatik" entscheidet die Regelung, welche Einstellung genutzt wird, um
                  das Ziel zu erreichen. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (sog.
                  1p3p).
                </template>
              </openwb-base-button-group-input>
            </openwb-base-card>
            <div v-if="!installAssistantActive">
              <hr />
              <openwb-base-heading>
                Laden nach Zeitplan
                <template #actions>
                  <openwb-base-avatar
                    class="bg-success clickable"
                    @click="addChargeTemplateTimeChargingPlan(templateKey, $event)"
                  >
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'plus']"
                    />
                  </openwb-base-avatar>
                </template>
                <template #help>
                  Mit einem Zeitplan kann ein klar abgegrenzter Zeitbereich zum Fahrzeugladen definiert werden. Dies
                  wird häufig genutzt, um einem Fahrzeug kurz vor der Abfahrt Strom anzubieten, damit dessen
                  Vorklimatisierung nicht aus dem Fahrzeugakku, sondern aus der openWB bezogen wird (Enteisung,
                  Vorwärmung, Abkühlung). Nicht von der Vorklimatisierung benötigter Strom erhöht dabei den
                  Fahrzeug-SoC. Um das Stromnetz am Morgen nicht unnötig zu strapazieren, sollte eine moderate
                  Stromvorgabe und ein beschränkter Zeitbereich vorgegeben werden (z.B. max. 10A; 30min - in
                  Übereinstimmung mit den Fahrzeug-App-Vorklimatisierungsvorgaben).
                </template>
              </openwb-base-heading>
            </div>
            <openwb-base-card
              v-for="(plan, planKey) in getChargeTemplateTimeChargingPlans(templateKey)"
              :key="planKey"
              :title="plan.name"
              :collapsible="true"
              :collapsed="true"
            >
              <template #actions="slotProps">
                <span
                  v-if="slotProps.collapsed == true"
                  class="subheader pill clickable"
                  :class="plan.active ? 'bg-success' : 'bg-danger'"
                  @click.stop="updateState(planKey, !plan.active, 'active')"
                >
                  <span v-if="plan.limit.selected == 'soc'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'car-battery']"
                    />
                    {{ plan.limit.soc }}%
                  </span>
                  <span v-if="plan.limit.selected == 'amount'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'bolt']"
                    />
                    {{ plan.limit.amount / 1000 }}kWh
                  </span>
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'clock']"
                  />
                  {{ plan.time[0] }} - {{ plan.time[1] }}
                  <span v-if="plan.frequency.selected == 'once'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-day']"
                    />
                    {{
                      formatDate(plan.frequency.once[0]) == formatDate(plan.frequency.once[1])
                        ? formatDate(plan.frequency.once[0])
                        : formatDate(plan.frequency.once[0]) + " - " + formatDate(plan.frequency.once[1])
                    }}
                  </span>
                  <span v-if="plan.frequency.selected == 'daily'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-week']"
                    />
                  </span>
                  <span v-if="plan.frequency.selected == 'weekly'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-alt']"
                    />
                  </span>
                </span>
                <openwb-base-avatar
                  v-if="slotProps.collapsed == false"
                  class="bg-danger clickable"
                  @click="removeChargeTemplateTimeChargingPlanModal(templateKey, planKey, $event)"
                >
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'trash']"
                  />
                </openwb-base-avatar>
              </template>
              <openwb-base-text-input
                title="Bezeichnung"
                :model-value="plan.name"
                @update:model-value="updateState(planKey, $event, 'name')"
              />
              <openwb-base-button-group-input
                title="Zeitplan aktiv"
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
                :model-value="plan.active"
                @update:model-value="updateState(planKey, $event, 'active')"
              />
              <openwb-base-range-input
                :title="'Ladestrom' + (dcChargingEnabled ? ' (AC)' : '')"
                :min="6"
                :max="32"
                :step="1"
                unit="A"
                :model-value="plan.current"
                @update:model-value="updateState(planKey, $event, 'current')"
              />
              <openwb-base-number-input
                v-if="dcChargingEnabled === true"
                title="Ladeleistung (DC)"
                unit="kW"
                :min="0"
                :model-value="ac_current2dc_power(plan.dc_current)"
                @update:model-value="updateState(planKey, dc_power2ac_current($event), 'dc_current')"
              />
              <openwb-base-button-group-input
                title="Ziel"
                :buttons="[
                  { buttonValue: 'none', text: 'Aus' },
                  {
                    buttonValue: 'soc',
                    text: 'Fahrzeug-SoC',
                  },
                  {
                    buttonValue: 'amount',
                    text: 'Energie',
                  },
                ]"
                :model-value="plan.limit.selected"
                @update:model-value="updateState(planKey, $event, 'limit.selected')"
              >
                <template #help> Bestimmt die Art der Grenze für den Ladevorgang. </template>
              </openwb-base-button-group-input>
              <openwb-base-range-input
                v-if="plan.limit.selected == 'soc'"
                title="Ziel-SoC für das Fahrzeug"
                :min="5"
                :max="100"
                :step="5"
                unit="%"
                :model-value="plan.limit.soc"
                @update:model-value="updateState(planKey, $event, 'limit.soc')"
              >
                <template #help>
                  Ladestand des Akku (State of Charge, SoC), bis zu welchem maximal geladen werden soll.
                </template>
              </openwb-base-range-input>
              <openwb-base-number-input
                v-if="plan.limit.selected == 'amount'"
                title="Ziel-Energie"
                unit="kWh"
                :min="1"
                :step="0.5"
                :model-value="plan.limit.amount / 1000"
                @update:model-value="updateState(planKey, $event * 1000, 'limit.amount')"
              >
                <template #help>
                  Maximal zu ladende Energie innerhalb des Zeitfensters. Eignet sich immer dann wenn kein SoC zur
                  Verfügung steht. Die geladene Energiemenge wird beim Wechsel des Lademodus, Wechsel des Plans oder
                  nach dem Anstecken, wenn Zeitladen schon aktiv ist, neu gezählt.
                </template>
              </openwb-base-number-input>

              <openwb-base-text-input
                title="Zeitpunkt des Ladebeginns"
                subtype="time"
                :model-value="plan.time[0]"
                @update:model-value="updateState(planKey, $event, 'time.0')"
              />
              <openwb-base-text-input
                title="Zeitpunkt des Ladeendes"
                subtype="time"
                :model-value="plan.time[1]"
                @update:model-value="updateState(planKey, $event, 'time.1')"
              />
              <openwb-base-button-group-input
                title="Wiederholungen"
                :buttons="[
                  {
                    buttonValue: 'once',
                    text: 'Einmalig',
                    class: 'btn-outline-info',
                  },
                  {
                    buttonValue: 'daily',
                    text: 'Täglich',
                    class: 'btn-outline-info',
                  },
                  {
                    buttonValue: 'weekly',
                    text: 'Wöchentlich',
                    class: 'btn-outline-info',
                  },
                ]"
                :model-value="plan.frequency.selected"
                @update:model-value="updateState(planKey, $event, 'frequency.selected')"
              />
              <openwb-base-text-input
                v-if="plan.frequency.selected == 'once'"
                title="Gültig ab"
                subtype="date"
                :model-value="plan.frequency.once[0]"
                @update:model-value="updateState(planKey, $event, 'frequency.once.0')"
              />
              <openwb-base-text-input
                v-if="plan.frequency.selected == 'once'"
                title="Gültig bis"
                subtype="date"
                :min="plan.frequency.once[0]"
                :model-value="plan.frequency.once[1]"
                @update:model-value="updateState(planKey, $event, 'frequency.once.1')"
              />
              <div v-if="plan.frequency.selected == 'weekly'">
                <openwb-base-button-group-input
                  v-for="(day, dayIndex) in weekdays"
                  :key="dayIndex"
                  :title="day"
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
                  :model-value="plan.frequency.weekly[dayIndex]"
                  @update:model-value="updateState(planKey, $event, 'frequency.weekly.' + dayIndex)"
                />
              </div>
            </openwb-base-card>
          </openwb-base-card>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="vehicleConfigForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus as fasPlus,
  faTrash as fasTrash,
  faCalendarDay as fasCalendarDay,
  faCalendarAlt as fasCalendarAlt,
  faCalendarWeek as fasCalendarWeek,
  faClock as fasClock,
  faCarBattery as fasCarBattery,
  faBolt as fasBolt,
  faCar as fasCar,
  faPlug as fasPlug,
} from "@fortawesome/free-solid-svg-icons";
import { faFile as farFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/vue-fontawesome";

library.add(
  fasPlus,
  fasTrash,
  fasCalendarDay,
  fasCalendarAlt,
  fasCalendarWeek,
  fasClock,
  fasCarBattery,
  fasBolt,
  fasCar,
  farFile,
  fasPlug,
);

import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbVehicleProxy from "../components/vehicles/OpenwbVehicleProxy.vue";

export default {
  name: "OpenwbVehicleConfigView",
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
    OpenwbVehicleProxy,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/optional/dc_charging",
        "openWB/optional/et/provider",
        "openWB/optional/rfid/active",
        "openWB/vehicle/template/ev_template/+",
        "openWB/vehicle/template/charge_template/+",
        "openWB/vehicle/template/charge_template/+/chargemode/scheduled_charging/plans/+",
        "openWB/vehicle/template/charge_template/+/time_charging/plans/+",
        "openWB/vehicle/+/name",
        "openWB/vehicle/+/info",
        "openWB/vehicle/+/charge_template",
        "openWB/vehicle/+/ev_template",
        "openWB/vehicle/+/tag_id",
        "openWB/system/configurable/soc_modules",
        "openWB/vehicle/+/soc_module/general_config",
        "openWB/vehicle/+/soc_module/config",
      ],
      showVehicleModal: false,
      modalVehicleIndex: undefined,
      showEvTemplateModal: false,
      modalEvTemplateIndex: undefined,
      showChargeTemplateModal: false,
      modalChargeTemplateIndex: undefined,
      showChargeTemplateSchedulePlanModal: false,
      modalChargeTemplateSchedulePlanIndex: undefined,
      showChargeTemplateTimeChargingPlanModal: false,
      modalChargeTemplateTimeChargingPlanIndex: undefined,
    };
  },
  computed: {
    dcChargingEnabled: {
      get() {
        return this.$store.state.mqtt["openWB/optional/dc_charging"];
      },
    },
    vehicleIndexes: {
      get() {
        return this.getWildcardIndexList("openWB/vehicle/+/name");
      },
    },
    evTemplates: {
      get() {
        return this.getWildcardTopics("openWB/vehicle/template/ev_template/+");
      },
    },
    evTemplateList: {
      get() {
        let myList = [];
        Object.keys(this.evTemplates).forEach((key) => {
          let index = parseInt(key.match(/([0-9]+)$/g)[0]);
          let name = this.$store.state.mqtt["openWB/vehicle/template/ev_template/" + index].name;
          myList.push({ value: index, text: name });
        });
        return myList;
      },
    },
    chargeTemplates: {
      get() {
        return this.getWildcardTopics("openWB/vehicle/template/charge_template/+");
      },
    },
    chargeTemplateList: {
      get() {
        let myList = [];
        Object.keys(this.chargeTemplates).forEach((key) => {
          let index = parseInt(key.match(/([0-9]+)$/g)[0]);
          let name = this.$store.state.mqtt["openWB/vehicle/template/charge_template/" + index].name;
          myList.push({ value: index, text: name });
        });
        return myList;
      },
    },
    socModuleList: {
      get() {
        return this.$store.state.mqtt["openWB/system/configurable/soc_modules"];
      },
    },
  },
  methods: {
    getChargeTemplateScheduledChargingPlans(chargeTemplate) {
      // get trailing characters as index
      let index = chargeTemplate.match(/([^/]+)$/)[0];
      let result = this.getWildcardTopics(
        "openWB/vehicle/template/charge_template/" + index + "/chargemode/scheduled_charging/plans/+",
      );
      return result;
    },
    getChargeTemplateTimeChargingPlans(chargeTemplate) {
      // get trailing characters as index
      let index = chargeTemplate.match(/([^/]+)$/)[0];
      let result = this.getWildcardTopics(
        "openWB/vehicle/template/charge_template/" + index + "/time_charging/plans/+",
      );
      return result;
    },
    addVehicle(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addVehicle",
        data: {},
      });
    },
    removeVehicleModal(vehicleIndex, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalVehicleIndex = vehicleIndex;
      this.showVehicleModal = true;
    },
    removeVehicle(vehicleIndex, event) {
      this.showVehicleModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeVehicle",
          data: { id: vehicleIndex },
        });
      }
    },
    getVehicleName(id) {
      return this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
        ? this.$store.state.mqtt["openWB/vehicle/" + id + "/name"]
        : "Fahrzeug " + id;
    },
    getSocDefaultConfiguration(socType) {
      const socDefaults = this.socModuleList.find((element) => element.value == socType);
      if (Object.prototype.hasOwnProperty.call(socDefaults, "defaults")) {
        return { ...JSON.parse(JSON.stringify(socDefaults.defaults)) };
      }
      console.warn("no default configuration found for soc type!", socType);
      return {};
    },
    updateSelectedSocModule(vehicleId, $event) {
      this.updateState("openWB/vehicle/" + vehicleId + "/soc_module/config", $event, "type");
      this.updateState("openWB/vehicle/" + vehicleId + "/soc_module/config", this.getSocDefaultConfiguration($event));
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
    addEvTemplate(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addEvTemplate",
        data: {},
      });
    },
    removeEvTemplateModal(evTemplate, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      this.modalEvTemplateIndex = parseInt(evTemplate.match(/([^/]+)$/)[0]);
      this.showEvTemplateModal = true;
    },
    removeEvTemplate(evTemplateIndex, event) {
      this.showEvTemplateModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeEvTemplate",
          data: { id: evTemplateIndex },
        });
      }
    },
    getEvTemplateName(id) {
      return this.$store.state.mqtt["openWB/vehicle/template/ev_template/" + id]
        ? this.$store.state.mqtt["openWB/vehicle/template/ev_template/" + id].name
        : "Fahrzeug-Profil " + id;
    },
    addChargeTemplate(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addChargeTemplate",
        data: {},
      });
    },
    getChargeTemplateIndex(chargeTemplate) {
      return parseInt(chargeTemplate.match(/([^/]+)$/)[0]);
    },
    removeChargeTemplateModal(chargeTemplate, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      this.modalChargeTemplateIndex = this.getChargeTemplateIndex(chargeTemplate);
      this.showChargeTemplateModal = true;
    },
    removeChargeTemplate(chargeTemplateIndex, event) {
      this.showChargeTemplateModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargeTemplate",
          data: { id: chargeTemplateIndex },
        });
      }
    },
    getChargeTemplateName(id) {
      return this.$store.state.mqtt["openWB/vehicle/template/charge_template/" + id]
        ? this.$store.state.mqtt["openWB/vehicle/template/charge_template/" + id].name
        : "Lade-Profil " + id;
    },
    getChargeTemplateSchedulePlanName(templateIndex, planIndex) {
      return this.$store.state.mqtt[
        "openWB/vehicle/template/charge_template/" + templateIndex + "/chargemode/scheduled_charging/plans/" + planIndex
      ]
        ? this.$store.state.mqtt[
            "openWB/vehicle/template/charge_template/" +
              templateIndex +
              "/chargemode/scheduled_charging/plans/" +
              planIndex
          ].name
        : "Zielladen Zeitplan " + templateIndex + "/" + planIndex;
    },
    addChargeTemplateSchedulePlan(template, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      let templateIndex = parseInt(template.match(/([^/]+)$/)[0]);
      this.$emit("sendCommand", {
        command: "addChargeTemplateSchedulePlan",
        data: { template: templateIndex },
      });
    },
    removeChargeTemplateSchedulePlanModal(chargeTemplate, plan, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      this.modalChargeTemplateIndex = parseInt(chargeTemplate.match(/([^/]+)$/)[0]);
      this.modalChargeTemplateSchedulePlanIndex = parseInt(plan.match(/([^/]+)$/)[0]);
      this.showChargeTemplateSchedulePlanModal = true;
    },
    removeChargeTemplateSchedulePlan(templateIndex, planIndex, event) {
      this.showChargeTemplateSchedulePlanModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargeTemplateSchedulePlan",
          data: { template: templateIndex, plan: planIndex },
        });
      }
    },
    getChargeTemplateTimeChargingPlanName(templateIndex, planIndex) {
      return this.$store.state.mqtt[
        "openWB/vehicle/template/charge_template/" + templateIndex + "/time_charging/plans/" + planIndex
      ]
        ? this.$store.state.mqtt[
            "openWB/vehicle/template/charge_template/" + templateIndex + "/time_charging/plans/" + planIndex
          ].name
        : "Zeitladen Zeitplan " + templateIndex + "/" + planIndex;
    },
    addChargeTemplateTimeChargingPlan(template, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      let templateIndex = parseInt(template.match(/([^/]+)$/)[0]);
      this.$emit("sendCommand", {
        command: "addChargeTemplateTimeChargingPlan",
        data: { template: templateIndex },
      });
    },
    removeChargeTemplateTimeChargingPlanModal(chargeTemplate, plan, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      this.modalChargeTemplateIndex = parseInt(chargeTemplate.match(/([^/]+)$/)[0]);
      this.modalChargeTemplateTimeChargingPlanIndex = parseInt(plan.match(/([^/]+)$/)[0]);
      this.showChargeTemplateTimeChargingPlanModal = true;
    },
    removeChargeTemplateTimeChargingPlan(templateIndex, planIndex, event) {
      this.showChargeTemplateTimeChargingPlanModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargeTemplateTimeChargingPlan",
          data: { template: templateIndex, plan: planIndex },
        });
      }
    },
  },
};
</script>
