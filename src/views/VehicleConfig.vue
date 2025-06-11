<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showVehicleModal"
    title="Fahrzeug löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeVehicle($event, modalVehicleIndex)"
  >
    Wollen Sie das Fahrzeug "{{ getVehicleName(modalVehicleIndex) }}" wirklich entfernen? Dieser Vorgang kann nicht
    rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showEvTemplateModal"
    title="Fahrzeug-Profil löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeEvTemplate($event, modalEvTemplateIndex)"
  >
    Wollen Sie das Fahrzeug-Profil "{{ getEvTemplateName(modalEvTemplateIndex) }}" wirklich entfernen? Dieser Vorgang
    kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showChargeTemplateModal"
    title="Lade-Profil löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeChargeTemplate($event, modalChargeTemplateIndex)"
  >
    Wollen Sie das Lade-Profil "{{ getChargeTemplateName(modalChargeTemplateIndex) }}" wirklich entfernen? Dieser
    Vorgang kann nicht rückgängig gemacht werden!
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
          <font-awesome-icon :icon="['fas', 'car']" />
          Fahrzeuge
        </template>
        <template #actions>
          <openwb-base-avatar
            v-if="$store.state.mqtt['openWB/general/extern'] === false"
            class="bg-success clickable"
            title="Neues Fahrzeug hinzufügen"
            @click="addVehicle"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
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
                title="Fahrzeug löschen"
                @click="removeVehicleModal($event, vehicleId)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
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
              <template #append>
                <openwb-base-color-picker
                  class="p-1"
                  :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/color']"
                  default-color="#17a2b8"
                  @update:model-value="updateState('openWB/vehicle/' + vehicleId + '/color', $event)"
                />
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
            <div v-if="!installAssistantActive">
              <openwb-base-heading> Fahrzeugzuordnung per ID-Tags </openwb-base-heading>
              <div v-if="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/tag_id'].length > 0">
                <openwb-base-alert subtype="info">
                  Einstellungen zur Fahrzeugzuordnung finden sich unter
                  <router-link to="/IdentificationConfig"> Einstellungen - Identifikation </router-link>.
                  <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === false">
                    Aktuell ist die Option in den Einstellungen deaktiviert.
                  </div>
                  <div v-else>
                    Die Option ist aktiv. Das Fahrzeug lässt sich per ID-Tag automatisch einem Ladepunkt zuordnen.
                  </div>
                  Dem Fahrzeug sind folgende ID-Tags zugeordnet:
                </openwb-base-alert>
                <openwb-base-array-input
                  title="Zugeordnete ID-Tags"
                  no-elements-message="Keine keine ID-Tags zugeordnet."
                  :no-input="true"
                  :model-value="$store.state.mqtt['openWB/vehicle/' + vehicleId + '/tag_id']"
                />
              </div>
              <div v-else>
                <openwb-base-alert subtype="info">
                  Einstellungen zur Fahrzeugzuordnung finden sich unter
                  <router-link to="/IdentificationConfig"> Einstellungen - Identifikation </router-link>.<br />
                  Dem Fahrzeug sind aktuell keine ID-Tags zum Entsperren zugeordnet.
                </openwb-base-alert>
              </div>
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
                :max="30"
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
                :min="5"
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
          <font-awesome-layers class="fa-lg">
            <font-awesome-icon :icon="['far', 'file']" />
            <font-awesome-icon
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
            title="Neues Fahrzeug-Profil hinzufügen"
            @click="addEvTemplate"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
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
              v-if="$store.state.mqtt['openWB/general/extern'] === false"
              #actions="slotProps"
            >
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-success clickable"
                title="Fahrzeug-Profil duplizieren"
                @click="addEvTemplate($event, key)"
              >
                <font-awesome-icon :icon="['fas', 'copy']" />
              </openwb-base-avatar>
              <openwb-base-avatar
                v-if="!slotProps.collapsed && !key.endsWith('/0')"
                class="bg-danger clickable ml-1"
                title="Fahrzeug-Profil löschen"
                @click="removeEvTemplateModal($event, key)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
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
            <openwb-base-button-group-input
              title="Bidirektionales Laden"
              :buttons="[
                {
                  buttonValue: false,
                  text: 'Nicht unterstützt',
                  class: 'btn-outline-danger',
                },
                {
                  buttonValue: true,
                  text: 'AC nach ISO15118-20',
                  class: 'btn-outline-success',
                },
              ]"
              :model-value="template.bidi"
              @update:model-value="updateState(key, $event, 'bidi')"
            >
              <template #help>
                Für bidirektionales Laden wird eine openWB Pro benötigt. Die openWB Pro muss auf den Modus "Bidi"
                gestellt werden.</template
              >
            </openwb-base-button-group-input>
            <div v-if="dcChargingEnabled === true">
              <openwb-base-heading> Angaben zur Ladeleistung (DC) </openwb-base-heading>
              <openwb-base-number-input
                title="Mindestleistung"
                :min="0"
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
              :min="0"
              :max="5"
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
                Anzahl der Phasen, die der Fahrzeuglader (s.g. OBC - OnboardCharger) verwendet. Plugin-Hybride nutzen
                meist nur eine Phase, reine E-Autos meist 3, manche nur 2 Phasen.
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
          <font-awesome-layers class="fa-lg">
            <font-awesome-icon :icon="['far', 'file']" />
            <font-awesome-icon
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
            title="Neues Lade-Profil hinzufügen"
            @click="addChargeTemplate"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
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
              !($route.params.section == 'charge_template' && parseInt($route.params.section_index) == template.id)
            "
          >
            <template #actions="slotProps">
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-success clickable"
                title="Lade-Profil duplizieren"
                @click="addChargeTemplate($event, templateKey)"
              >
                <font-awesome-icon :icon="['fas', 'copy']" />
              </openwb-base-avatar>
              <openwb-base-avatar
                v-if="!slotProps.collapsed && !templateKey.endsWith('/0')"
                class="bg-danger clickable ml-1"
                title="Lade-Profil löschen"
                @click.stop="removeChargeTemplateModal($event, template.id)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
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
            <!-- @button-click added below in oder for openActiveChargeMode to be called even when the mode does not change
            (case: the same charge mode button is pressed twice in oder to only open the corresponding charge mode card if
            other charge mode cards have been manually opened with toggle in <openwb-base-button-group-input>)  -->
            <openwb-base-button-group-input
              title="Aktiver Lademodus"
              :buttons="[
                { buttonValue: 'instant_charging', text: 'Sofort', class: 'btn-outline-danger' },
                { buttonValue: 'pv_charging', text: 'PV', class: 'btn-outline-success' },
                { buttonValue: 'scheduled_charging', text: 'Ziel', class: 'btn-outline-primary' },
                { buttonValue: 'eco_charging', text: 'Eco', class: 'btn-outline-secondary' },
                { buttonValue: 'stop', text: 'Stop', class: 'btn-outline-dark' },
              ]"
              :model-value="template.chargemode.selected"
              @update:model-value="updateState(templateKey, $event, 'chargemode.selected')"
              @button-click="openActiveChargeModeCard(templateKey, $event)"
            >
              <template #help>
                Diese Einstellung entspricht dem gewählten Lademodus auf der Hauptseite und ist aktiv, wenn ein
                zugehöriges Fahrzeug angesteckt ist.<br />
                Die zur Verfügung stehende Leistung wird intern anhand folgender Prioritätenliste auf die Fahrzeuge bzw.
                Ladepunkte verteilt:<br />
                <ol>
                  <li>Ziel (Sofortladen) mit Priorität</li>
                  <li>Ziel (Sofortladen)</li>
                  <li>Zeit mit Priorität</li>
                  <li>Zeit</li>
                  <li>Sofort mit Priorität</li>
                  <li>Sofort</li>
                  <li>Eco (Min-Anteil) mit Priorität</li>
                  <li>Eco (Min-Anteil)</li>
                  <li>PV (Min-Anteil) mit Priorität</li>
                  <li>PV (Min-Anteil)</li>
                  <li>Ziel (PV) mit Priorität</li>
                  <li>Ziel (PV)</li>
                  <li>Eco (PV-Anteil) mit Priorität</li>
                  <li>Eco (PV-Anteil)</li>
                  <li>PV (PV-Anteil) mit Priorität</li>
                  <li>PV (PV-Anteil)</li>
                  <li>Bidi-Entladen ohne Priorität</li>
                  <li>Bidi-Entladen mit Priorität</li>
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
              <!-- Standard nach Abstecken kann auch ohne RFID genutzt werden.
                Die Option ist zusätzlich im Lade-Profil verfügbar
              -->
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
              <openwb-base-heading>Einstellungen der Lademodi</openwb-base-heading>
            </div>
            <openwb-base-card
              :ref="`card-${templateKey}-instant_charging`"
              :collapsible="true"
              :collapsed="true"
              subtype="secondary"
            >
              <template #header> Sofort </template>
              <openwb-base-range-input
                :title="`Soll-Ladestrom${dcChargingEnabled ? ' (AC)' : ''}`"
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
                  Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in
                  Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Voraussetzung ist die
                  verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (s.g. 1p3p).
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
                @update:model-value="
                  updateState(templateKey, $event * 1000, 'chargemode.instant_charging.limit.amount')
                "
              >
                <template #help> Die geladene Energiemenge wird nach dem Anstecken neu gezählt. </template>
              </openwb-base-number-input>
            </openwb-base-card>

            <openwb-base-card
              :ref="`card-${templateKey}-pv_charging`"
              :collapsible="true"
              :collapsed="true"
              subtype="secondary"
            >
              <template #header> PV </template>
              <openwb-base-range-input
                :title="`Minimaler Dauerstrom${dcChargingEnabled ? ' (AC)' : ''}`"
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
                  Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in
                  Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus "Automatik"
                  entscheidet die Regelung, welche Einstellung genutzt wird, um den verfügbaren Überschuss in die
                  Fahrzeuge zu laden. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen einer und mehreren
                  Phasen (sog. 1p3p).
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
                  PV kann ohne Fahrzeug-SoC-Begrenzung (Aus), mit Begrenzung des Fahrzeug-SoC (SoC) bei konfiguriertem
                  SoC-Auslesemodul oder mittels Vorgabe eine gewünschten Energiemenge in kWh (Energie) genutzt werden.
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
                <template #help> Die geladene Energiemenge wird nach dem Anstecken neu gezählt. </template>
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
                  Liegt der Fahrzeug-Ladestand (SoC) unter dem hier eingestellten Wert, dann wird bis zum Erreichen
                  dieses Wertes mit dem eingestellten "Mindest-SoC-Strom" geladen. Dies dient der Sicherstellung eines
                  "Mindest-SoC" - z.B. für eine immer abzudeckende Fahrzeugreichweite - auch wenn kein oder zu wenig
                  Überschuss verfügbar ist (=> Laden mit anteilig Netzstrom). Nach dem Erreichen des "Mindest-SoC" wird
                  bei verfügbarem Überschuss geladen.<br />
                  Um die Fahrzeug-SoC-Begrenzung nutzen zu können, muss ein SoC-Modul für das jeweilige Fahrzeug
                  eingerichtet sein (siehe "Konfiguration" -> "Fahrzeuge" -> "SoC-Modul").
                </template>
              </openwb-base-range-input>
              <openwb-base-range-input
                :title="`Mindest-SoC-Strom${dcChargingEnabled ? ' (AC)' : ''}`"
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
                  Überschuss ein Ladevorgang mit der hier festgelegten "Mindest-SoC-Leistung" initiiert (ggf. mit
                  anteilig Netzbezug).
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
                  Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in
                  Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Voraussetzung ist die
                  verbaute Umschaltmöglichkeit zwischen einer und mehreren Phasen (sog. 1p3p).
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
                  Erläuterung siehe "Ladeeinstellungen" -> "PV-Laden" -> "Regelparameter" -> "Regelpunkt
                  Einspeisegrenze"
                </template>
              </openwb-base-button-group-input>
            </openwb-base-card>
            <openwb-base-card
              :ref="`card-${templateKey}-scheduled_charging`"
              :collapsible="true"
              :collapsed="true"
              subtype="secondary"
            >
              <template #header> Ziel </template>
              <openwb-base-heading>
                Zielladepläne
                <template #actions>
                  <openwb-base-avatar
                    class="bg-success clickable"
                    title="Neuen Zielladen-Plan hinzufügen"
                    @click.stop="addChargeTemplateSchedulePlan(template.id)"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </openwb-base-avatar>
                </template>
                <template #help>
                  Im Lademodus "Zielladen" wird der Ladestrom so angepasst, dass das Fahrzeug zum angegebenen Zeitpunkt
                  den eingestellten SoC bzw. die einzuladende Energiemenge erreicht. Anhand des vorgegebenen Ladestroms
                  wird der Zeitpunkt berechnet, an dem die Ladung spätestens starten muss.<br />
                  Ist der berechnete Zeitpunkt des Ladestarts noch nicht erreicht, wird mit Überschuss geladen. Auch
                  nach Erreichen des Ziel-SoCs wird mit Überschuss geladen, solange bis das "SoC-Limit für das Fahrzeug"
                  erreicht wird.<br />
                  Es wird nach den Vorgaben des Zeitplans geladen, dessen Zieltermin am nächsten liegt. Ist der
                  Zielzeitpunkt vorbei, wird solange geladen bis, das Ziel erreicht oder das Auto abgesteckt wird. Wenn
                  der Ziel-Termin des nächsten Plans innerhalb der nächsten 12 Stunden liegt, wird auf den nächsten Plan
                  umgeschaltet.
                </template>
              </openwb-base-heading>
              <openwb-base-alert
                v-if="template.chargemode.scheduled_charging.plans.length == 0"
                subtype="info"
              >
                Es wurden noch keine Pläne für das Zielladen angelegt.
              </openwb-base-alert>
              <charge-template-scheduled-charging-plan
                v-for="(plan, planKey) in template.chargemode.scheduled_charging.plans"
                :key="planKey"
                :model-value="plan"
                :template-id="template.id"
                :dc-charging-enabled="dcChargingEnabled"
                @update:model-value="updateState(templateKey, $event, `chargemode.scheduled_charging.plans.${planKey}`)"
                @send-command="$emit('sendCommand', $event)"
              />
            </openwb-base-card>
            <openwb-base-card
              :ref="`card-${templateKey}-eco_charging`"
              :collapsible="true"
              :collapsed="true"
              subtype="secondary"
            >
              <template #header> Eco </template>
              <openwb-base-heading
                >Arbeitsweise von Eco
                <template #help>
                  Im Eco-Modus wird eine Preisgrenze vorgegeben. Wenn der Strompreis unter dieser Grenze liegt, wird mit
                  dem eingestellten Ladestrom geladen und -falls vorhanden- zusätzlich mit dem Überschuss. Wenn die
                  Preisgrenze überschritten wird, wird nur mit Überschuss geladen, wenn dieser vorhanden ist.
                </template>
              </openwb-base-heading>
              <openwb-base-range-input
                :title="`Minimaler Dauerstrom unter der Preisgrenze${dcChargingEnabled ? ' (AC)' : ''}`"
                :min="6"
                :max="32"
                :step="1"
                unit="A"
                :model-value="template.chargemode.eco_charging.current"
                @update:model-value="updateState(templateKey, $event, 'chargemode.eco_charging.current')"
              />
              <openwb-base-number-input
                v-if="dcChargingEnabled === true"
                title="Minimale Dauerleistung unter der Preisgrenze (DC)"
                unit="kW"
                :min="0"
                :model-value="ac_current2dc_power(template.chargemode.eco_charging.dc_current)"
                @update:model-value="
                  updateState(templateKey, dc_power2ac_current($event), 'chargemode.eco_charging.dc_current')
                "
              />
              <openwb-base-button-group-input
                title="Anzahl Phasen"
                :buttons="[
                  { buttonValue: 1, text: '1' },
                  { buttonValue: 3, text: 'Maximum' },
                  { buttonValue: 0, text: 'Automatik' },
                ]"
                :model-value="template.chargemode.eco_charging.phases_to_use"
                @update:model-value="updateState(templateKey, $event, 'chargemode.eco_charging.phases_to_use')"
              >
                <template #help>
                  Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in
                  Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus "Automatik"
                  entscheidet die Regelung, welche Einstellung genutzt wird, um den verfügbaren Überschuss in die
                  Fahrzeuge zu laden. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen einer und mehreren
                  Phasen (sog. 1p3p).
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
                :model-value="template.chargemode.eco_charging.limit.selected"
                @update:model-value="updateState(templateKey, $event, 'chargemode.eco_charging.limit.selected')"
              >
                <template #help>
                  Eco kann ohne Fahrzeug-SoC-Begrenzung (Aus), mit Begrenzung des Fahrzeug-SoC (SoC) bei konfiguriertem
                  SoC-Auslesemodul oder mittels Vorgabe eine gewünschten Energiemenge in kWh (Energie) genutzt werden.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-range-input
                title="SoC-Limit für das Fahrzeug"
                :min="5"
                :max="100"
                :step="5"
                unit="%"
                :model-value="template.chargemode.eco_charging.limit.soc"
                @update:model-value="updateState(templateKey, $event, 'chargemode.eco_charging.limit.soc')"
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
                :model-value="template.chargemode.eco_charging.limit.amount / 1000"
                @update:model-value="updateState(templateKey, $event * 1000, 'chargemode.eco_charging.limit.amount')"
              >
                <template #help> Die geladene Energiemenge wird nach dem Anstecken neu gezählt. </template>
              </openwb-base-number-input>
              <openwb-base-alert
                v-if="
                  !$store.state.mqtt['openWB/optional/et/provider'] ||
                  !$store.state.mqtt['openWB/optional/et/provider'].type
                "
                subtype="warning"
              >
                Bitte in den übergreifenden Ladeeinstellungen einen Strompreis-Anbieter konfigurieren. Ohne
                Strompreis-Anbieter wird im Modus Eco nur geladen, wenn Überschuss vorhanden ist.
              </openwb-base-alert>
              <openwb-base-number-input
                title="Preisgrenze für strompreisbasiertes Laden"
                min="-80"
                max="80"
                step="0.01"
                :precision="2"
                unit="ct/kWh"
                :model-value="template.chargemode.eco_charging.max_price * 100000"
                @update:model-value="
                  updateState(
                    templateKey,
                    parseFloat(($event / 100000).toFixed(7)),
                    'chargemode.eco_charging.max_price',
                  )
                "
              >
              </openwb-base-number-input>
            </openwb-base-card>
            <div v-if="!installAssistantActive">
              <hr />
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
                  <p>
                    Der Lademodus Zeit kann parallel zu einem der anderen Lademodi aktiviert werden. Die Auswahl des
                    Lademodus, der in der Regelung genutzt wird, erfolgt anhand der Übersicht in der Hilfe bei "Aktiver
                    Lademodus". Wenn kein Zeitplan aktiv ist oder das Limit des Zeitplans erreicht wurde, wird der
                    Lademodus verwendet, der bei "Aktiver Lademodus" ausgewählt ist.
                  </p>
                  <p>
                    Mit einem Zeitplan kann ein klar abgegrenzter Zeitbereich zum Fahrzeugladen definiert werden. Dies
                    wird häufig genutzt, um einem Fahrzeug kurz vor der Abfahrt Strom anzubieten, damit dessen
                    Vorklimatisierung nicht aus dem Fahrzeugakku, sondern aus der openWB bezogen wird (Enteisung,
                    Vorwärmung, Abkühlung). Nicht von der Vorklimatisierung benötigter Strom erhöht dabei den
                    Fahrzeug-SoC. Um das Stromnetz am Morgen nicht unnötig zu strapazieren, sollte eine moderate
                    Stromvorgabe und ein beschränkter Zeitbereich vorgegeben werden (z.B. max. 10A; 30min - in
                    Übereinstimmung mit den Fahrzeug-App-Vorklimatisierungsvorgaben).
                  </p>
                </template>
              </openwb-base-button-group-input>
              <openwb-base-card
                :ref="`card-${templateKey}-scheduled_charging`"
                :collapsible="true"
                :collapsed="true"
                subtype="secondary"
              >
                <template #header> Zeitladen-Pläne </template>
                <template #actions>
                  <openwb-base-avatar
                    class="bg-success clickable"
                    title="Neuen Zeitladen-Plan hinzufügen"
                    @click.stop="addChargeTemplateTimeChargingPlan(template.id)"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </openwb-base-avatar>
                </template>
                <openwb-base-alert
                  v-if="(template.time_charging.plans ?? []).length == 0"
                  subtype="info"
                >
                  Es wurden noch keine Pläne für das Zeitladen angelegt.
                </openwb-base-alert>
                <charge-template-time-charging-plan
                  v-for="(plan, planKey) in template.time_charging.plans ?? []"
                  :key="planKey"
                  :model-value="plan"
                  :template-id="template.id"
                  :dc-charging-enabled="dcChargingEnabled"
                  @update:model-value="updateState(templateKey, $event, `time_charging.plans.${planKey}`)"
                  @send-command="$emit('sendCommand', $event)"
                />
              </openwb-base-card>
            </div>
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
  faCoins as fasCoins,
  faCopy as fasCopy,
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
  fasCoins,
  fasCopy,
);

import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbVehicleProxy from "../components/vehicles/OpenwbVehicleProxy.vue";
import ChargeTemplateScheduledChargingPlan from "../components/vehicles/ChargeTemplateScheduledChargingPlan.vue";
import ChargeTemplateTimeChargingPlan from "../components/vehicles/ChargeTemplateTimeChargingPlan.vue";

export default {
  name: "OpenwbVehicleConfigView",
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
    OpenwbVehicleProxy,
    ChargeTemplateScheduledChargingPlan,
    ChargeTemplateTimeChargingPlan,
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
        "openWB/vehicle/+/color",
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
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
    /* vehicle management */
    addVehicle(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addVehicle",
        data: {},
      });
    },
    removeVehicleModal(event, vehicleIndex) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalVehicleIndex = vehicleIndex;
      this.showVehicleModal = true;
    },
    removeVehicle(event, vehicleIndex) {
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
    /* ev template management */
    addEvTemplate(event, keyToCopy) {
      // prevent further processing of the click event
      event.stopPropagation();
      let data = {};
      // if keyToCopy is set, parse the id from the key
      if (keyToCopy && keyToCopy.match(/([^/]+)$/)) {
        data.copy = parseInt(keyToCopy.match(/([^/]+)$/)[0]);
      }
      // emit the command to add an ev template
      this.$emit("sendCommand", {
        command: "addEvTemplate",
        data: data,
      });
    },
    removeEvTemplateModal(event, evTemplate) {
      // prevent further processing of the click event
      event.stopPropagation();
      // get trailing characters as index
      this.modalEvTemplateIndex = parseInt(evTemplate.match(/([^/]+)$/)[0]);
      this.showEvTemplateModal = true;
    },
    removeEvTemplate(event, evTemplateIndex) {
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
    /* charge template management */
    addChargeTemplate(event, keyToCopy) {
      // prevent further processing of the click event
      event.stopPropagation();
      let data = {};
      // if keyToCopy is set, parse the id from the key
      if (keyToCopy && keyToCopy.match(/([^/]+)$/)) {
        data.copy = parseInt(keyToCopy.match(/([^/]+)$/)[0]);
      }
      // emit the command to add a charge template
      this.$emit("sendCommand", {
        command: "addChargeTemplate",
        data: data,
      });
    },
    removeChargeTemplateModal(event, chargeTemplateId) {
      this.modalChargeTemplateIndex = chargeTemplateId;
      this.showChargeTemplateModal = true;
    },
    removeChargeTemplate(event, chargeTemplateIndex) {
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
    /* charge template schedule plan management */
    addChargeTemplateSchedulePlan(templateId) {
      this.$emit("sendCommand", {
        command: "addChargeTemplateSchedulePlan",
        data: { template: templateId },
      });
    },
    /* charge template time charging plan management */
    addChargeTemplateTimeChargingPlan(templateId) {
      this.$emit("sendCommand", {
        command: "addChargeTemplateTimeChargingPlan",
        data: { template: templateId },
      });
    },
    openActiveChargeModeCard(templateKey, activeMode) {
      // Only open the active card
      this.$nextTick(() => {
        const modes = ["instant_charging", "pv_charging", "eco_charging", "scheduled_charging"];
        modes.forEach((mode) => {
          const refName = `card-${templateKey}-${mode}`;
          const cardRef = this.$refs[refName];
          const card = Array.isArray(cardRef) ? cardRef[0] : cardRef;
          if (card) {
            card.isCollapsed = mode !== activeMode;
          }
        });
      });
    },
  },
};
</script>
