<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showChargePointModal"
    title="Ladepunkt löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeChargePoint(modalChargePointIndex, $event)"
  >
    Wollen Sie den Ladepunkt "{{ getChargePointName(modalChargePointIndex) }}" (ID: {{ modalChargePointIndex }})
    wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showChargePointTemplateModal"
    title="Ladepunkt-Profil löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeChargePointTemplate(modalChargePointTemplateIndex, $event)"
  >
    Wollen Sie das Ladepunkt-Profil "{{ getChargePointTemplateName(modalChargePointTemplateIndex) }}" (ID:
    {{ modalChargePointTemplateIndex }}) wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showChargePointTemplateAutolockPlanModal"
    title="Autolock Zeitplan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="
      removeChargePointTemplateAutolockPlan(
        modalChargePointTemplateIndex,
        modalChargePointTemplateAutolockPlanIndex,
        $event,
      )
    "
  >
    Wollen Sie den Autolock Zeitplan "{{
      getChargePointTemplateAutolockPlanName(modalChargePointTemplateIndex, modalChargePointTemplateAutolockPlanIndex)
    }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <!-- main content -->
  <div class="chargePointInstallation">
    <form name="chargePointInstallationForm">
      <!-- charge point card -->
      <openwb-base-card
        title="Ladepunkte"
        subtype="primary"
        :collapsible="true"
        :collapsed="!installAssistantActive"
      >
        <template #header>
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'charging-station']"
          />
          Ladepunkte
        </template>
        <openwb-base-card
          v-for="(installedChargePoint, installedChargePointKey) in installedChargePoints"
          :key="installedChargePointKey"
          :title="installedChargePoint.name + ' (ID: ' + installedChargePoint.id + ')'"
          :collapsible="true"
          :collapsed="true"
          subtype="primary"
        >
          <template #actions="slotProps">
            <openwb-base-avatar
              v-if="!slotProps.collapsed"
              class="bg-danger clickable"
              @click="removeChargePointModal(installedChargePointKey, $event)"
            >
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'trash']"
              />
            </openwb-base-avatar>
          </template>
          <openwb-base-text-input
            title="Bezeichnung"
            subtype="text"
            :model-value="installedChargePoint.name"
            @update:model-value="updateState(installedChargePointKey, $event, 'name')"
          />
          <openwb-base-text-input
            title="Modul"
            subtype="text"
            disabled
            readonly
            :model-value="$store.state.mqtt[installedChargePointKey].type"
          />
          <span
            v-if="
              installedChargePoint.type !== 'internal_openwb' || $store.state.mqtt['openWB/general/extern'] === false
            "
          >
            <openwb-base-select-input
              title="Ladepunkt-Profil"
              :options="chargePointTemplateList"
              :model-value="$store.state.mqtt[installedChargePointKey].template"
              @update:model-value="updateState(installedChargePointKey, $event, 'template')"
            />
          </span>
          <openwb-base-text-input
            v-if="$store.state.mqtt['openWB/optional/ocpp/config']['active'] === true"
            title="OCPP-Chargebox ID"
            :model-value="installedChargePoint.ocpp_chargebox_id"
            @update:model-value="updateState(installedChargePointKey, $event, 'ocpp_chargebox_id')"
          >
            <template #help>
              Bitte geben Sie hier die Chargebox ID ein, die im OCPP-Backend für diesen Ladepunkt verwendet wird. Sollen
              die Daten dieses Ladepunktes nicht an ein OCPP-Backend übertragen werden, lasse dieses Feld leer.
            </template>
          </openwb-base-text-input>
          <hr />
          <openwb-charge-point-proxy
            :charge-point="installedChargePoint"
            @update:configuration="updateConfiguration(installedChargePointKey, $event)"
          />
          <div
            v-if="
              (installedChargePoint.type !== 'internal_openwb' ||
                $store.state.mqtt['openWB/general/extern'] === false) &&
              installedChargePoint.charging_type !== 'DC'
            "
          >
            <hr />
            <openwb-base-heading> Hardware-Optionen </openwb-base-heading>
            <openwb-base-button-group-input
              title="automatische Phasenumschaltung vorhanden"
              :buttons="[
                { buttonValue: false, text: 'Nein' },
                { buttonValue: true, text: 'Ja' },
              ]"
              :model-value="installedChargePoint.auto_phase_switch_hw"
              @update:model-value="updateState(installedChargePointKey, $event, 'auto_phase_switch_hw')"
            />
            <openwb-base-button-group-input
              title="Control-Pilot-Unterbrechung vorhanden"
              :buttons="[
                { buttonValue: false, text: 'Nein' },
                { buttonValue: true, text: 'Ja' },
              ]"
              :model-value="installedChargePoint.control_pilot_interruption_hw"
              @update:model-value="updateState(installedChargePointKey, $event, 'control_pilot_interruption_hw')"
            >
              <template #help>
                Die Control-Pilot-Leitung ist im Ladekabel integriert und dient der Steuerung der Fahrzeugladung
                (An/Aus/Stromvorgaben). Bei einigen Fahrzeugen können durch die Regelung erzwungene, längere Ladestopps
                (z.B. beim PV-Laden) zu unerwünschten "Einschlaf"-Effekten des Fahrzeuges führen. Mit diesem Feature,
                welches hardwareseitig verbaut sein muss, kann ein Abstecken des Ladesteckers simuliert werden, um ein
                Aufwecken des Fahrzeuges zu ermöglichen. Die Funktion hängt immer auch vom Fahrzeugtyp ab.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-heading> Elektrischer Anschluss </openwb-base-heading>
            <openwb-base-button-group-input
              title="Anzahl angeschlossener Phasen"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 2, text: '2' },
                { buttonValue: 3, text: '3' },
              ]"
              :model-value="installedChargePoint.connected_phases"
              @update:model-value="updateState(installedChargePointKey, $event, 'connected_phases')"
            />
            <openwb-base-button-group-input
              title="Phase 1 des Ladekabels"
              :buttons="[
                { buttonValue: 1, text: 'EVU L1' },
                { buttonValue: 2, text: 'EVU L2' },
                { buttonValue: 3, text: 'EVU L3' },
              ]"
              :model-value="installedChargePoint.phase_1"
              @update:model-value="updateState(installedChargePointKey, $event, 'phase_1')"
            >
              <template #help>
                Hier ist anzugeben, an welcher Phase des Hausanschlusses (EVU-Punkt) die Phase 1 dieses Ladepunktes
                angeschlossen ist. Diese Information wird für das Lastmanagement benötigt, um bei einer Schieflast
                gezielt einzelne Ladepunkte zu drosseln.<br />
                Bei mehreren Ladepunkten macht es Sinn, die Phasen der LP rotierend anzuschließen, damit mehrere
                "nicht-dreiphasig" ladende Fahrzeuge mit optimaler Leistung laden können, bevor das Lastmanagement
                eingreift.<br />
                Es wird vorausgesetzt, dass das Drehfeld innerhalb der Installation gleich bleibt. Wenn z.B. L1 des
                Ladepunktes auf EVU-L2 liegt, muss L2 des Ladepunktes auf EVU-L3 aufgelegt sein (und L3 des Ladepunktes
                auf EVU-L1).<br />
                Eine Möglichkeit, die zur Ladepunktphase L1 zugehörige EVU-Phase zu ermitteln, ist eine einphasige
                Ladung zu starten und die Phasenströme am EVU-Zähler zu beobachten. Mit einem zweiphasig ladenden
                Fahrzeug kann danach auch der Anschluss von L2 ermittelt und so das Drehfeld kontrolliert werden.<br />
                Im Zweifel bitte das Drehfeld von einer Fachkraft prüfen und korrigieren lassen.
              </template>
            </openwb-base-button-group-input>
          </div>
        </openwb-base-card>
        <hr v-if="Object.keys(installedChargePoints).length > 0" />
        <openwb-base-select-input
          title="Verfügbare Ladepunkte"
          not-selected="Bitte auswählen"
          :options="getChargePointList()"
          :model-value="chargePointToAdd"
          :add-button="true"
          @update:model-value="chargePointToAdd = $event"
          @input:add="addChargePoint"
        >
          <template #help>
            Bitte einen Ladepunkt auswählen, der der openWB-Regelung hinzugefügt werden soll.<br />
            <ul>
              <li>
                Interne openWB - wenn diese openWB über einen verbauten Ladepunkt mit Regelcontroller verfügt (z.B.
                Standard(+), Custom, Duo, Buchse, NICHT Standalone); ansonsten immer anlegen, egal ob diese openWB
                steuert = primary oder ferngesteuert wird = secondary
              </li>
              <li>
                Externe openWB - wenn diese openWB (primary) die Fernsteuerung von externen openWB (secondary) übernimmt
              </li>
              <li>MQTT-Ladepunkt - nur zur Nutzung des openWB-Simulators zugelassen</li>
              <li>openWB Pro - wenn diese openWB (primary) die Fernsteuerung einer openWB Pro (secondary) übernimmt</li>
              <li>
                openWB series2 Satellit/Satellit Duo - wenn diese openWB (primary) die Fernsteuerung einer openWB
                series2 Satellit/Satellit Duo (secondary) übernimmt
              </li>
              <li>
                smartWB/EVSE-Wifi - wenn diese openWB (primary) die Fernsteuerung einer smartWB/EVSE-Wifi übernimmt
              </li>
            </ul>
          </template>
        </openwb-base-select-input>
      </openwb-base-card>
      <hr class="border-secondary" />
      <!-- charge point template card -->
      <openwb-base-card
        title="Ladepunkt-Profile"
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
              :icon="['fas', 'charging-station']"
              transform="shrink-8"
            />
          </font-awesome-layers>
          Ladepunkt-Profile
        </template>
        <template #actions>
          <openwb-base-avatar
            v-if="$store.state.mqtt['openWB/general/extern'] === false"
            class="bg-success clickable"
            @click="addChargePointTemplate"
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
            v-for="(chargePointTemplate, chargePointTemplateKey) in chargePointTemplates"
            :key="chargePointTemplateKey"
            :title="chargePointTemplate.name + ' (ID: ' + getChargePointTemplateIndex(chargePointTemplateKey) + ')'"
            :collapsible="true"
            :collapsed="true"
          >
            <template
              v-if="!chargePointTemplateKey.endsWith('/0')"
              #actions="slotProps"
            >
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeChargePointTemplateModal(chargePointTemplateKey, $event)"
              >
                <font-awesome-icon
                  fixed-width
                  :icon="['fas', 'trash']"
                />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              subtype="text"
              :model-value="chargePointTemplate.name"
              :disabled="chargePointTemplateKey.endsWith('/0')"
              @update:model-value="updateState(chargePointTemplateKey, $event, 'name')"
            >
              <template
                v-if="chargePointTemplateKey.endsWith('/0')"
                #help
              >
                Das Standard-Profil kann nicht umbenannt werden.
              </template>
            </openwb-base-text-input>
            <openwb-base-button-group-input
              v-if="dcChargingEnabled === true"
              title="Typ des Ladeprofils"
              :buttons="[
                { buttonValue: 'AC', text: 'AC' },
                { buttonValue: 'DC', text: 'DC' },
              ]"
              :model-value="chargePointTemplate.charging_type"
              @update:model-value="updateState(chargePointTemplateKey, $event, 'charging_type')"
            />
            <hr />
            <openwb-base-heading> Zugangskontrolle </openwb-base-heading>
            <openwb-base-button-group-input
              title="Sperre nach Abstecken"
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
              :model-value="chargePointTemplate.disable_after_unplug"
              @update:model-value="updateState(chargePointTemplateKey, $event, 'disable_after_unplug')"
            >
              <template #help> Sperrt den Ladepunkt nach Abstecken eines Fahrzeuges. </template>
            </openwb-base-button-group-input>
            <div v-if="$store.state.mqtt['openWB/optional/rfid/active'] === true && !installAssistantActive">
              <openwb-base-array-input
                v-if="chargePointTemplate.disable_after_unplug"
                title="Zugeordnete ID-Tags"
                no-elements-message="Keine ID-Tags zugeordnet."
                :model-value="chargePointTemplate.valid_tags"
                @update:model-value="updateState(chargePointTemplateKey, $event, 'valid_tags')"
              >
                <template #help>
                  Die hier eingetragenen ID-Tags dienen ausschließlich zum Entsperren des Ladepunktes.
                </template>
              </openwb-base-array-input>
            </div>
            <hr />
            <openwb-base-heading> Angaben zum konfigurierten Ladestrom der openWB </openwb-base-heading>
            <openwb-base-alert subtype="info">
              Hier werden die maximalen Ladeströme entsprechend der in dem zugeordneten Ladepunkt genutzten Phasen
              eingestellt.<br />
              Generell gilt, dass diese Werte in Übereinstimmung mit der Ausführung des Ladepunktes und des elektrischen
              Anschlusses bzw. der Absicherung zu wählen sind.
              <span v-if="chargePointTemplate.charging_type === 'AC'">
                Bei einer openWB mit 22kW Maximalleistung sind hier jeweils 32A einzustellen. Ist die openWB
                beispielsweise auf 11kW begrenzt (KfW-Förderung oder die Zuleitung ist mit 16A abgesichert), dann sind
                hier jeweils 16A einzustellen. </span
              ><br />
              Komplexere Installationen mit mehreren Ladepunkten werden im
              <a
                href="https://github.com/openWB/core/wiki/Lastmanagement-und-kaskadierte-Z%C3%A4hler"
                target="_blank"
                rel="noopener noreferrer"
                >Wiki zum Lastmanagement</a
              >
              beschrieben.
            </openwb-base-alert>
            <div v-if="chargePointTemplate.charging_type === 'AC' || dcChargingEnabled !== true">
              <openwb-base-range-input
                title="Maximalstrom bei einer Phase"
                :min="6"
                :max="32"
                :step="1"
                unit="A"
                :model-value="chargePointTemplate.max_current_single_phase"
                @update:model-value="updateState(chargePointTemplateKey, $event, 'max_current_single_phase')"
              />
              <openwb-base-range-input
                title="Maximalstrom mehrere Phasen"
                :min="6"
                :max="32"
                :step="1"
                unit="A"
                :model-value="chargePointTemplate.max_current_multi_phases"
                @update:model-value="updateState(chargePointTemplateKey, $event, 'max_current_multi_phases')"
              />
            </div>
            <openwb-base-number-input
              v-else
              title="Maximalleistung"
              :min="75"
              :max="300"
              :step="75"
              unit="kW"
              :precision="5"
              :model-value="ac_current2dc_power(chargePointTemplate.dc_max_current)"
              @update:model-value="updateState(chargePointTemplateKey, dc_power2ac_current($event), 'dc_max_current')"
            />
            <hr />
            <div v-if="!installAssistantActive">
              <hr />
              <openwb-base-heading> Automatische Sperre </openwb-base-heading>
              <openwb-base-button-group-input
                title="Automatische Sperre aktiv"
                :buttons="[
                  { buttonValue: false, text: 'Nein' },
                  { buttonValue: true, text: 'Ja' },
                ]"
                :model-value="chargePointTemplate.autolock.active"
                @update:model-value="updateState(chargePointTemplateKey, $event, 'autolock.active')"
              >
                <template #help>
                  Wird die automatische Sperre aktiviert, können Fahrzeugladungen mittels Zeitplan auf gewünschte
                  Zeitbereiche eingeschränkt werden. Dies kann z.B. bei Zugänglichkeiten zu Ladepunkten in öffentlichen
                  oder halb-öffentlichen Bereichen sinnvoll sein.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-button-group-input
                title="Erst nach Ladeende sperren"
                :buttons="[
                  { buttonValue: false, text: 'Nein' },
                  { buttonValue: true, text: 'Ja' },
                ]"
                :model-value="chargePointTemplate.autolock.wait_for_charging_end"
                @update:model-value="updateState(chargePointTemplateKey, $event, 'autolock.wait_for_charging_end')"
              >
                <template #help>
                  Wenn ein Zeitplan die automatische Sperre aktiviert, werden alle Ladepunkte direkt gesperrt und
                  laufende Ladevorgänge beendet. Wird hier "Ja" ausgewählt, dann werden laufende Ladevorgänge NICHT
                  beendet und diese Ladepunkte erst nach abgeschlossener Ladung gesperrt.
                </template>
              </openwb-base-button-group-input>

              <openwb-base-heading>
                Zeitpläne für die automatische Sperre
                <template #actions>
                  <openwb-base-avatar
                    class="bg-success clickable"
                    @click="addChargePointTemplateAutolockPlan(chargePointTemplateKey, $event)"
                  >
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'plus']"
                    />
                  </openwb-base-avatar>
                </template>
              </openwb-base-heading>
            </div>
            <openwb-base-card
              v-for="(autolockPlan, autolockPlanKey) in getChargePointTemplateAutolockPlans(chargePointTemplateKey)"
              :key="autolockPlanKey"
              :title="autolockPlan.name"
              :collapsible="true"
              :collapsed="true"
            >
              <template #actions="slotProps">
                <span
                  v-if="slotProps.collapsed == true"
                  class="subheader pill clickable"
                  :class="autolockPlan.active ? 'bg-success' : 'bg-danger'"
                  @click.stop="updateState(autolockPlanKey, !autolockPlan.active, 'active')"
                >
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'clock']"
                  />
                  {{ autolockPlan.time[0] }} -
                  {{ autolockPlan.time[1] }}
                  <span v-if="autolockPlan.frequency.selected == 'once'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-day']"
                    />
                    {{
                      formatDate(autolockPlan.frequency.once[0]) == formatDate(autolockPlan.frequency.once[1])
                        ? formatDate(autolockPlan.frequency.once[0])
                        : formatDate(autolockPlan.frequency.once[0]) +
                          " - " +
                          formatDate(autolockPlan.frequency.once[1])
                    }}
                  </span>
                  <span v-if="autolockPlan.frequency.selected == 'daily'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-week']"
                    />
                  </span>
                  <span v-if="autolockPlan.frequency.selected == 'weekly'">
                    <font-awesome-icon
                      fixed-width
                      :icon="['fas', 'calendar-alt']"
                    />
                  </span>
                </span>
                <openwb-base-avatar
                  v-if="slotProps.collapsed == false"
                  class="bg-danger clickable"
                  @click="removeChargePointTemplateAutolockPlanModal(chargePointTemplateKey, autolockPlanKey, $event)"
                >
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'trash']"
                  />
                </openwb-base-avatar>
              </template>
              <openwb-base-text-input
                title="Bezeichnung"
                :model-value="autolockPlan.name"
                @update:model-value="updateState(autolockPlanKey, $event, 'name')"
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
                :model-value="autolockPlan.active"
                @update:model-value="updateState(autolockPlanKey, $event, 'active')"
              />
              <openwb-base-text-input
                title="Sperren um"
                subtype="time"
                :model-value="autolockPlan.time[0]"
                @update:model-value="updateState(autolockPlanKey, $event, 'time.0')"
              />
              <openwb-base-text-input
                title="Freigeben um"
                subtype="time"
                :model-value="autolockPlan.time[1]"
                @update:model-value="updateState(autolockPlanKey, $event, 'time.1')"
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
                :model-value="autolockPlan.frequency.selected"
                @update:model-value="updateState(autolockPlanKey, $event, 'frequency.selected')"
              />
              <openwb-base-text-input
                v-if="autolockPlan.frequency.selected == 'once'"
                title="Sperren ab ..."
                subtype="date"
                :model-value="autolockPlan.frequency.once[0]"
                @update:model-value="updateState(autolockPlanKey, $event, 'frequency.once.0')"
              />
              <openwb-base-text-input
                v-if="autolockPlan.frequency.selected == 'once'"
                title="... bis"
                subtype="date"
                :min="autolockPlan.frequency.once[0]"
                :model-value="autolockPlan.frequency.once[1]"
                @update:model-value="updateState(autolockPlanKey, $event, 'frequency.once.1')"
              />
              <div v-if="autolockPlan.frequency.selected == 'weekly'">
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
                  :model-value="autolockPlan.frequency.weekly[dayIndex]"
                  @update:model-value="updateState(autolockPlanKey, $event, 'frequency.weekly.' + dayIndex)"
                />
              </div>
            </openwb-base-card>
          </openwb-base-card>
        </div>
      </openwb-base-card>

      <openwb-base-submit-buttons
        form-name="chargePointInstallationForm"
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
  faChargingStation as fasChargingStation,
} from "@fortawesome/free-solid-svg-icons";
import { faFile as farFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash, fasCalendarDay, fasCalendarAlt, fasCalendarWeek, fasChargingStation, farFile);

import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbChargePointProxy from "../components/charge_points/OpenwbChargePointProxy.vue";

export default {
  name: "OpenwbChargePointInstallationView",
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
    OpenwbChargePointProxy,
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
        "openWB/optional/ocpp/config",
        "openWB/optional/rfid/active",
        "openWB/chargepoint/+/config",
        "openWB/chargepoint/template/+",
        "openWB/chargepoint/template/+/autolock/+",
        "openWB/system/configurable/chargepoints",
        "openWB/system/configurable/chargepoints_internal",
      ],
      chargePointToAdd: undefined,
      showChargePointModal: false,
      modalChargePointIndex: undefined,
      showChargePointTemplateModal: false,
      modalChargePointTemplateIndex: undefined,
      showChargePointTemplateAutolockPlanModal: false,
      modalChargePointTemplateAutolockPlanIndex: undefined,
    };
  },
  computed: {
    dcChargingEnabled: {
      get() {
        return this.$store.state.mqtt["openWB/optional/dc_charging"];
      },
    },
    installedChargePoints: {
      get() {
        // only show internal chargepoint(s) when configured as external chargepoint
        let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
        let myObj = {};
        for (const [key, element] of Object.entries(chargePoints)) {
          if (element.type === "internal_openwb" || this.$store.state.mqtt["openWB/general/extern"] === false) {
            myObj[key] = element;
          }
        }
        return myObj;
      },
    },
    chargePointTemplates: {
      get() {
        return this.getWildcardTopics("openWB/chargepoint/template/+");
      },
    },
    chargePointTemplateList: {
      get() {
        let myList = [];
        Object.keys(this.chargePointTemplates).forEach((key) => {
          let index = parseInt(key.match(/([0-9]+)/g)[0]);
          let name = this.$store.state.mqtt["openWB/chargepoint/template/" + index].name;
          myList.push({ value: index, text: name });
        });
        return myList;
      },
    },
  },
  methods: {
    addChargePoint() {
      this.$emit("sendCommand", {
        command: "addChargepoint",
        data: { type: this.chargePointToAdd },
      });
    },
    removeChargePointModal(chargePoint, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalChargePointIndex = parseInt(chargePoint.match(/(?:\/)(\d+)(?=\/)/)[1]);
      this.showChargePointModal = true;
    },
    removeChargePoint(chargePointIndex, event) {
      this.showChargePointModal = false;
      if (event == "confirm") {
        console.debug("request removal of charge point '" + chargePointIndex + "'");
        this.$emit("sendCommand", {
          command: "removeChargepoint",
          data: { id: chargePointIndex },
        });
      }
    },
    getChargePointList() {
      if (this.$store.state.mqtt["openWB/general/extern"] === false) {
        return this.$store.state.mqtt["openWB/system/configurable/chargepoints"];
      } else {
        return this.$store.state.mqtt["openWB/system/configurable/chargepoints_internal"];
      }
    },
    getChargePointName(chargePointIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/config"]
        ? this.$store.state.mqtt["openWB/chargepoint/" + chargePointIndex + "/config"].name
        : "Ladepunkt " + chargePointIndex;
    },
    getChargePointTemplateName(chargePointTemplateIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/template/" + chargePointTemplateIndex]
        ? this.$store.state.mqtt["openWB/chargepoint/template/" + chargePointTemplateIndex].name
        : "Profil " + chargePointTemplateIndex;
    },
    addChargePointTemplate(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addChargepointTemplate",
        data: {},
      });
    },
    getChargePointTemplateIndex(chargePointTemplate) {
      // get trailing characters as index
      return parseInt(chargePointTemplate.match(/([^/]+)$/)[0]);
    },
    removeChargePointTemplateModal(chargePointTemplate, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalChargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      this.showChargePointTemplateModal = true;
    },
    removeChargePointTemplate(chargePointTemplateIndex, event) {
      this.showChargePointTemplateModal = false;
      if (event == "confirm") {
        console.debug("request removal of chargePoint template '" + chargePointTemplateIndex + "'");
        this.$emit("sendCommand", {
          command: "removeChargepointTemplate",
          data: { id: chargePointTemplateIndex },
        });
      }
    },
    addChargePointTemplateAutolockPlan(chargePointTemplate, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      console.info("requesting new charge point template autolock plan...");
      let chargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      this.$emit("sendCommand", {
        command: "addAutolockPlan",
        data: { template: chargePointTemplateIndex },
      });
    },
    removeChargePointTemplateAutolockPlanModal(chargePointTemplate, autolockPlan, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalChargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      this.modalChargePointTemplateAutolockPlanIndex = parseInt(autolockPlan.match(/([^/]+)$/)[0]);
      this.showChargePointTemplateAutolockPlanModal = true;
    },
    removeChargePointTemplateAutolockPlan(chargePointTemplateIndex, autolockPlanIndex, event) {
      this.showChargePointTemplateAutolockPlanModal = false;
      if (event == "confirm") {
        console.debug(
          "request removal of chargePoint template '" +
            chargePointTemplateIndex +
            "' autolock plan '" +
            autolockPlanIndex +
            "'",
        );
        this.$emit("sendCommand", {
          command: "removeAutolockPlan",
          data: {
            template: chargePointTemplateIndex,
            plan: autolockPlanIndex,
          },
        });
      }
    },
    getChargePointTemplateAutolockPlanName(templateIndex, planIndex) {
      return this.$store.state.mqtt["openWB/chargepoint/template/" + templateIndex + "/autolock/" + planIndex]
        ? this.$store.state.mqtt["openWB/chargepoint/template/" + templateIndex + "/autolock/" + planIndex].name
        : "Autolock Zeitplan " + templateIndex + "/" + planIndex;
    },
    getChargePointTemplateAutolockPlans(chargePointTemplate) {
      let chargePointTemplateIndex = this.getChargePointTemplateIndex(chargePointTemplate);
      let result = this.getWildcardTopics("openWB/chargepoint/template/" + chargePointTemplateIndex + "/autolock/+");
      return result;
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>

<style scoped>
.highlight {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
