<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showConsumerRemoveModal"
    title="Verbraucher löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeConsumer"
  >
    Willst Du den Verbraucher "{{ modalConsumerName }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
    werden!
  </openwb-base-modal-dialog>
  <!-- main content -->
  <div class="consumerConfig">
    <openwb-base-alert subtype="info">
      Das Einschalten der Verbraucher richtet sich nach der Rangfolge in der Prioritäten-Steuerung (Geräte werden von
      oben nach unten geschaltet) und dem Mindeststrom des jeweiligen Geräts: Bei geringem Überschuss wird das erste
      Gerät in der Liste geschaltet, dessen Mindeststrom erreicht ist. Die Rangfolge lässt sich unter "Lastmanagement"
      anpassen.
    </openwb-base-alert>
    <form name="consumerConfigForm">
      <!-- General Settings -->
      <openwb-base-card>
        <template #header>
          <font-awesome-icon :icon="['fas', 'cog']" />
          Einstellungen für Überschuss-Betrieb
        </template>
        <openwb-base-number-input
          title="Einschaltverzögerung"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_on_delay']"
          :min="0"
          :max="300"
          :step="1"
          unit="s"
          @update:model-value="updateState('openWB/general/consumer/config/switch_on_delay', $event)"
        />
        <openwb-base-number-input
          title="Ausschaltverzögerung"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_off_delay']"
          :min="0"
          :max="300"
          :step="1"
          unit="s"
          @update:model-value="updateState('openWB/general/consumer/config/switch_off_delay', $event)"
        />
        <openwb-base-number-input
          title="Ausschaltschwelle"
          :model-value="$store.state.mqtt['openWB/general/consumer/config/switch_off_threshold']"
          :min="0"
          :max="30000"
          :step="1"
          unit="W"
          @update:model-value="updateState('openWB/general/consumer/config/switch_off_threshold', $event)"
        />
      </openwb-base-card>
      <!-- Consumer section -->
      <openwb-base-card title="Verbraucher">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <!-- Individual Consumer cards -->
          <openwb-base-card
            v-for="(installedConsumer, installedConsumerKey) in installedConsumers"
            :key="installedConsumerKey"
            :collapsible="true"
            :collapsed="true"
            subtype="purple"
          >
            <template #header>
              <font-awesome-icon
                :icon="['fas', 'plug']"
                class="fa-border"
                :style="{
                  backgroundColor: installedConsumer.color,
                  color: getContrastColor(installedConsumer.color),
                  '--fa-border-color': getContrastColor(installedConsumer.color),
                }"
              />
              {{ installedConsumer?.name }}
            </template>
            <template #actions="slotProps">
              <openwb-base-avatar
                v-if="!slotProps.collapsed"
                class="bg-danger clickable"
                @click="removeConsumerModal(installedConsumer?.id, installedConsumer?.name, $event)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              subtype="text"
              :model-value="installedConsumer?.name"
              @update:model-value="updateState(installedConsumerKey, $event, 'name')"
            >
              <template #append>
                <openwb-base-color-picker
                  class="p-1"
                  :model-value="installedConsumer.color"
                  :default-color="consumerDefaultColor"
                  @update:model-value="updateState(installedConsumerKey, $event, 'color')"
                />
              </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              title="Hersteller"
              subtype="text"
              :model-value="installedConsumer.info?.manufacturer"
              @update:model-value="updateState(installedConsumerKey, $event, 'info.manufacturer')"
            >
              <template #help> Optional: zusätzliche Information für den Systembericht. </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              title="Modell"
              subtype="text"
              :model-value="installedConsumer.info?.model"
              @update:model-value="updateState(installedConsumerKey, $event, 'info.model')"
            >
              <template #help> Optional: zusätzliche Information für den Systembericht. </template>
            </openwb-base-text-input>

            <hr />

            <openwb-consumer-config-proxy
              :device="installedConsumer"
              @update:configuration="consumerDeviceConfiguration(installedConsumer, $event)"
            />
            <hr />
            <openwb-base-heading> Elektrischer Anschluss </openwb-base-heading>
            <openwb-base-button-group-input
              title="Anzahl angeschlossener Phasen"
              :buttons="[
                { buttonValue: 1, text: '1' },
                { buttonValue: 2, text: '2' },
                { buttonValue: 3, text: '3' },
              ]"
              :model-value="installedConsumer.config?.connected_phases"
              @update:model-value="
                updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'connected_phases')
              "
            />
            <openwb-base-button-group-input
              title="Phase 1 des Verbraucheranschlusses"
              :buttons="[
                { buttonValue: 1, text: 'EVU L1' },
                { buttonValue: 2, text: 'EVU L2' },
                { buttonValue: 3, text: 'EVU L3' },
              ]"
              :model-value="installedConsumer?.config?.phase_1"
              @update:model-value="updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'phase_1')"
            >
            </openwb-base-button-group-input>
            <openwb-base-number-input
              title="Maximale Leistung"
              unit="W"
              :min="1"
              :model-value="installedConsumer?.config?.max_power"
              @update:model-value="updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'max_power')"
            >
              <template #help>
                Maximale Leistungsaufnahme des Geräts. Wird im Sofort-, Zeit- und Eco-Betrieb (bei günstigem Preis) als
                Sollleistung verwendet.
              </template>
            </openwb-base-number-input>
            <openwb-base-number-input
              title="Minimaler Betriebsstrom"
              unit="A"
              :min="0"
              :step="0.1"
              :model-value="installedConsumer.config?.min_current"
              @update:model-value="updateState(`openWB/consumer/${installedConsumer.id}/config`, $event, 'min_current')"
            >
              <template #help>
                Mindeststrom, den das Gerät zum Betrieb benötigt. Im PV- und Eco-Betrieb wird das Gerät nur
                eingeschaltet, wenn mindestens dieser Strom als Überschuss verfügbar ist.
              </template>
            </openwb-base-number-input>
            <openwb-base-number-input
              :title="
                installedConsumer.consumerUsage?.type === 'suspendable_onoff'
                  ? 'Minimale Programmdauer (vom längsten Programm)'
                  : 'Minimiales Regelintervall'
              "
              unit="min"
              :min="0"
              :step="1"
              :model-value="
                installedConsumer.config?.min_interval != null ? installedConsumer.config.min_interval / 60 : null
              "
              @update:model-value="
                updateState(`openWB/consumer/${installedConsumer.id}/config`, $event * 60, 'min_interval')
              "
            >
              <template #help>
                <span v-if="installedConsumer.consumerUsage?.type === 'suspendable_onoff'">
                  Mindestlaufzeit, die der Verbraucher nach dem Einschalten eingeschaltet bleibt. Auf die Dauer des
                  längsten Programms einstellen, damit ein gestartetes Programm vollständig durchlaufen kann.
                </span>
                <span v-else>
                  Mindestzeit, die der Verbraucher in einem Schaltzustand bleibt, bevor neu geregelt wird. Träge Geräte
                  (z. B. Wärmepumpen) reagieren langsam und benötigen hier größere Werte.
                </span>
              </template>
            </openwb-base-number-input>
            <hr />
            <openwb-base-heading> Verwendung Optionen </openwb-base-heading>
            <openwb-base-select-input
              title="Verwendung"
              not-selected="Bitte auswählen"
              :options="[
                        { value: 'meter_only', text: 'Nur Messung' },
                        { value: 'suspendable_onoff', text: 'Schaltbar (Ein/Aus)' },
                        { value: 'suspendable_tunable', text: 'Stufenlos regelbar' },
                        { value: 'continuous', text: 'Dauerverbraucher' }
                      ]"
              :model-value="installedConsumer.consumerUsage.type"
              @update:model-value="updateUsage(installedConsumer.id, $event, 'type')"
            >
              <template #help>
                Nur Messung: Verbraucher, die nicht angesteuert werden können.<br />
                Schaltbar (Ein/Aus): Geräte, die ein- und ausgeschaltet werden können (auch mit SG-Ready-Kontakt).
                Unterbrechung im laufenden Betrieb ist möglich.<br />
                Stufenlos regelbar: Geräte, denen eine Leistung vorgegeben werden kann. Unterbrechung im laufenden
                Betrieb ist möglich.<br />
                Dauerverbraucher: Geräte, die ein- und ausgeschaltet werden können, bei denen eine Unterbrechung im
                laufenden Betrieb nicht möglich ist, z. B. Spülmaschine oder Trockner.
              </template>
            </openwb-base-select-input>
            <template v-if="showModeSettings(installedConsumer)">
              <hr />
              <openwb-base-heading> Betriebsmodus </openwb-base-heading>
              <openwb-base-button-group-input
                title="Betriebsmodus"
                :buttons="[
                  { buttonValue: 'instant_charging', text: 'Sofort', class: 'btn-outline-danger' },
                  { buttonValue: 'pv_charging', text: 'PV', class: 'btn-outline-success' },
                  { buttonValue: 'scheduled_charging', text: 'Ziel', class: 'btn-outline-primary' },
                  { buttonValue: 'eco_charging', text: 'Eco', class: 'btn-outline-secondary' },
                  { buttonValue: 'stop', text: 'Stop', class: 'btn-outline-dark' },
                ]"
                :model-value="installedConsumer.consumerUsage.chargemode"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'chargemode')"
                @button-click="openActiveModeCard(installedConsumer.id, $event)"
              >
                <template #help>
                  Sofort = dauerhaft an, Stop = dauerhaft aus. PV, Eco und Ziel schalten den Verbraucher nach
                  Überschuss, Strompreis bzw. Zeitplan.
                </template>
              </openwb-base-button-group-input>
              <hr />
              <openwb-base-heading> Betriebsmodus umstellen </openwb-base-heading>
              <openwb-base-button-group-input
                title="Umstellen"
                :buttons="[
                  { buttonValue: 'never', text: 'Nie', class: 'btn-outline-secondary' },
                  { buttonValue: 'midnight', text: 'Mitternacht', class: 'btn-outline-info' },
                  { buttonValue: 'time', text: 'Zeitpunkt', class: 'btn-outline-info' },
                ]"
                :model-value="installedConsumer.consumerUsage.reset_chargemode?.mode ?? 'never'"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'reset_chargemode.mode')"
              >
                <template #help>
                  <template v-if="installedConsumer.consumerUsage.reset_chargemode?.mode === 'midnight'">
                    Stellt den Betriebsmodus automatisch auf einen anderen Modus um: "Mitternacht" täglich um 0:00 Uhr
                  </template>
                  <template v-else-if="installedConsumer.consumerUsage.reset_chargemode?.mode === 'time'">
                    Stellt den Betriebsmodus automatisch auf einen anderen Modus um, einmalig zum angegebenen Zeitpunkt.
                  </template>
                  <template v-else> Stellt den Betriebsmodus nicht automatisch um. </template>
                </template>
              </openwb-base-button-group-input>
              <template v-if="(installedConsumer.consumerUsage.reset_chargemode?.mode ?? 'never') !== 'never'">
                <openwb-base-text-input
                  v-if="installedConsumer.consumerUsage.reset_chargemode?.mode === 'time'"
                  title="Datum"
                  subtype="date"
                  :model-value="resetDateParts(installedConsumer).date"
                  @update:model-value="setResetDate(installedConsumer, $event)"
                />
                <openwb-base-text-input
                  v-if="installedConsumer.consumerUsage.reset_chargemode?.mode === 'time'"
                  title="Uhrzeit"
                  subtype="time"
                  :model-value="resetDateParts(installedConsumer).time"
                  @update:model-value="setResetTime(installedConsumer, $event)"
                />
                <openwb-base-button-group-input
                  title="Zielmodus"
                  :buttons="[
                    { buttonValue: 'instant_charging', text: 'Sofort', class: 'btn-outline-danger' },
                    { buttonValue: 'pv_charging', text: 'PV', class: 'btn-outline-success' },
                    { buttonValue: 'scheduled_charging', text: 'Ziel', class: 'btn-outline-primary' },
                    { buttonValue: 'eco_charging', text: 'Eco', class: 'btn-outline-secondary' },
                    { buttonValue: 'stop', text: 'Stop', class: 'btn-outline-dark' },
                  ]"
                  :model-value="installedConsumer.consumerUsage.reset_chargemode?.chargemode"
                  @update:model-value="updateUsage(installedConsumer.id, $event, 'reset_chargemode.chargemode')"
                >
                  <template #help> Der Modus, auf den der Verbraucher umgestellt wird. </template>
                </openwb-base-button-group-input>
              </template>
              <hr />
              <openwb-base-button-group-input
                title="Anlauferkennung"
                :buttons="[
                  { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
                  { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
                ]"
                :model-value="installedConsumer.consumerUsage.wait_for_start_active"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'wait_for_start_active')"
              >
                <template #help>
                  Das Gerät wird eingeschaltet, um seine Startsequenz (z. B. Befüllen,
                  Türverriegelung) abzuwarten. Sobald der Strom den eingestellten Minimalstrom übersteigt, wird das Gerät als aktiv erkannt, das Gerät abgeschaltet und es übernimmt der gewählte Betriebsmodus. So kann
                  z. B. eine Waschmaschine morgens befüllt werden und läuft erst an, wenn genug Überschuss vorhanden
                  ist. Für Geräte ohne Anlaufsequenz (z. B. Wärmepumpen) deaktivieren.</br>
                  Die Anlauferkennung wird bei Ablauf eines Ziel- oder Zeitplans und beim Ändern des Betriebsmodus zurückgesetzt.
                </template>
              </openwb-base-button-group-input>
              <hr />
              <openwb-base-card
                :ref="`card-${installedConsumer.id}-instant_charging`"
                :collapsible="true"
                :collapsed="installedConsumer.consumerUsage.chargemode !== 'instant_charging'"
                title="Sofort"
                subtype="secondary"
              >
                <openwb-base-alert
                  v-if="installedConsumer.consumerUsage.type === 'suspendable_tunable'"
                  subtype="info"
                >
                  Das Gerät wird sofort mit maximaler Leistung eingeschaltet.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else
                  subtype="info"
                >
                  Das Gerät wird sofort eingeschaltet.
                </openwb-base-alert>
              </openwb-base-card>
              <openwb-base-card
                :ref="`card-${installedConsumer.id}-pv_charging`"
                :collapsible="true"
                :collapsed="installedConsumer.consumerUsage.chargemode !== 'pv_charging'"
                title="PV"
                subtype="secondary"
              >
                <openwb-base-alert
                  v-if="installedConsumer.consumerUsage.type === 'suspendable_onoff'"
                  subtype="info"
                >
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde. Das Gerät wird frühestens wieder ausgeschaltet, wenn die minimale Betriebsdauer
                  erreicht wurde, um sicherzustellen, dass das Programm vollständig durchlaufen kann.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else-if="installedConsumer.consumerUsage.type === 'suspendable_tunable'"
                  subtype="info"
                >
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde und bei ausreichend Überschuss hoch geregelt.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else
                  subtype="info"
                >
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde.
                </openwb-base-alert>
              </openwb-base-card>
              <openwb-base-card
                :ref="`card-${installedConsumer.id}-scheduled_charging`"
                :collapsible="true"
                :collapsed="installedConsumer.consumerUsage.chargemode !== 'scheduled_charging'"
                title="Ziel"
                subtype="secondary"
              >
                <openwb-base-alert
                  v-if="installedConsumer.consumerUsage.type === 'suspendable_onoff'"
                  subtype="info"
                >
                  Wenn der Preis vorher günstig ist oder genug Überschuss da ist, wird vorher gestartet, sonst so, dass
                  die Mindestlaufzeit erreicht wird.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else-if="installedConsumer.consumerUsage.type === 'suspendable_tunable'"
                  subtype="info"
                >
                  Wenn der Preis vorher günstig ist oder genug Überschuss da ist, wird vorher gestartet, sonst mit
                  maximaler Stromstärke, sodass die Mindestlaufzeit erreicht wird.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else
                  subtype="info"
                >
                  Jeder Plan führt einen Programm-Durchlauf des Geräts durch. Wenn der Preis vorher günstig ist oder
                  genug Überschuss da ist, wird vorher gestartet, sonst zu angegebenen Uhrzeit.
                </openwb-base-alert>
                <hr />
                <openwb-base-heading>
                  Ziel-Pläne
                  <template #actions>
                    <openwb-base-avatar
                      class="bg-success clickable"
                      title="Neuen Zielladen-Plan hinzufügen"
                      @click.stop="
                        commandAfterSavingConsumerUsage(
                          'addConsumerSchedulePlan',
                          { consumer_id: installedConsumer.id },
                          true,
                        )
                      "
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />
                    </openwb-base-avatar>
                  </template>
                </openwb-base-heading>
                <openwb-base-alert
                  v-if="!installedConsumer.consumerUsage.scheduled_charging?.plans?.length"
                  subtype="info"
                >
                  Es wurde noch kein Zielplan angelegt.
                </openwb-base-alert>
                <consumer-scheduled-plan
                  v-for="(plan, planKey) in installedConsumer.consumerUsage.scheduled_charging?.plans ?? []"
                  :key="plan.id"
                  :model-value="plan"
                  :consumer-id="installedConsumer.id"
                  @update:model-value="updateUsage(installedConsumer.id, $event, `scheduled_charging.plans.${planKey}`)"
                  @send-command="commandAfterSavingConsumerUsage($event.command, $event.data, true)"
                />
              </openwb-base-card>
              <openwb-base-card
                :ref="`card-${installedConsumer.id}-eco_charging`"
                :collapsible="true"
                :collapsed="installedConsumer.consumerUsage.chargemode !== 'eco_charging'"
                title="Eco"
                subtype="secondary"
              >
                <openwb-base-alert
                  v-if="installedConsumer.consumerUsage.type === 'suspendable_onoff'"
                  subtype="info"
                >
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde oder der Preis unter die Strompreisgrenze fällt. Das Gerät wird frühestens wieder
                  ausgeschaltet, wenn die minimale Betriebsdauer erreicht wurde, um sicherzustellen, dass das Programm
                  vollständig durchlaufen kann.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else-if="installedConsumer.consumerUsage.type === 'suspendable_tunable'"
                  subtype="info"
                >
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde und bei ausreichend Überschuss hoch geregelt oder mit maximaler Leistung
                  eingeschaltet, wenn der Preis unter die Strompreisgrenze fällt.
                </openwb-base-alert>
                <openwb-base-alert
                  v-else
                  subtype="info"
                >
                  Das Gerät wird eingeschaltet, wenn der min. Betriebsstrom für die Dauer der Einschaltverzögerung
                  überschritten wurde oder der Preis unter die Strompreisgrenze fällt.
                </openwb-base-alert>
                <openwb-base-number-input
                  title="Strompreisgrenze"
                  unit="ct/kWh"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  :model-value="installedConsumer.consumerUsage.eco_charging.price_limit * 100000"
                  @update:model-value="
                    updateUsage(
                      installedConsumer.id,
                      parseFloat(($event / 100000).toFixed(7)),
                      'eco_charging.price_limit',
                    )
                  "
                >
                  <template #help>
                    Eco schaltet den Verbraucher ein, sobald der variable Strompreis unter diesem Wert liegt. Dafür muss
                    ein Strompreis-Anbieter konfiguriert sein.
                  </template>
                </openwb-base-number-input>
              </openwb-base-card>
              <hr />
              <openwb-base-heading> Zeit-Pläne </openwb-base-heading>
              <openwb-base-button-group-input
                title="Zeit-Pläne aktiv"
                :buttons="[
                  { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
                  { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
                ]"
                :model-value="installedConsumer.consumerUsage.time_charging.active"
                @update:model-value="updateUsage(installedConsumer.id, $event, 'time_charging.active')"
              >
                <template #help>
                  Zeit-Pläne schalten das Gerät innerhalb der festgelegten Zeit-Plan ein, unabhängig vom oben gewählten
                  Betriebsmodus.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-card
                :collapsible="true"
                :collapsed="true"
                subtype="secondary"
              >
                <template #header> Zeit-Pläne </template>
                <template #actions>
                  <openwb-base-avatar
                    class="bg-success clickable"
                    title="Neuen Zeitladen-Plan hinzufügen"
                    @click.stop="
                      commandAfterSavingConsumerUsage(
                        'addConsumerTimePlan',
                        { consumer_id: installedConsumer.id },
                        true,
                      )
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </openwb-base-avatar>
                </template>
                <openwb-base-alert
                  v-if="!installedConsumer.consumerUsage.time_charging.plans?.length"
                  subtype="info"
                >
                  Es wurde noch kein Zeit-Plan angelegt.
                </openwb-base-alert>
                <consumer-time-charging-plan
                  v-for="(plan, planKey) in installedConsumer.consumerUsage.time_charging.plans ?? []"
                  :key="plan.id"
                  :model-value="plan"
                  :consumer-id="installedConsumer.id"
                  @update:model-value="updateUsage(installedConsumer.id, $event, `time_charging.plans.${planKey}`)"
                  @send-command="commandAfterSavingConsumerUsage($event.command, $event.data, true)"
                />
              </openwb-base-card>
            </template>
            <hr />
            <openwb-base-heading> Integrierter Zähler </openwb-base-heading>
            <openwb-base-alert
              v-if="!hasIntegratedCounter[installedConsumer.id] && !hasExtraMeter(installedConsumer.id)"
              subtype="warning"
            >
              Der Verbraucher hat keinen integrierten Zähler und es ist kein separater Zähler verknüpft. Der Verbraucher anhand der eingegebenen
              minimalen Leistung geschaltet.
            </openwb-base-alert>
            <openwb-base-alert
              v-if="!hasIntegratedCounter[installedConsumer.id] && hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Dieser Verbraucher verfügt über keinen integrierten Zähler. Ein separater Zähler ist verknüpft.
            </openwb-base-alert>
            <openwb-base-alert
              v-if="hasIntegratedCounter[installedConsumer.id] && !hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Die Messwerte werden aus dem integrierten Zähler des Verbrauchers ausgelesen. Falls gewünscht, kann ein separater Zähler verknüpft werden, der
              die Messwerte des integrierten Zählers überschreibt.
            </openwb-base-alert>
            <openwb-base-alert
              v-if="hasIntegratedCounter[installedConsumer.id] && hasExtraMeter(installedConsumer.id)"
              subtype="info"
            >
              Ein separater Zähler ist verknüpft. Die Messwerte des integrierten Zählers werden durch die Werte des
              separaten Zählers überschrieben.
            </openwb-base-alert>
            <hr />
            <openwb-base-heading> Separate Leistungsmessung </openwb-base-heading>
            <openwb-base-alert subtype="info">
              Lege den Zähler zuerst unter <router-link to="/HardwareInstallation">Geräte und Komponenten</router-link>
              an und verknüpfe ihn anschließend hier mit dem Verbraucher. Der EVU-Zähler sowie Zähler, die bereits einem
              anderen Verbraucher zugeordnet sind, stehen nicht zur Auswahl.
            </openwb-base-alert>
            <openwb-base-select-input
              title="Zähler"
              :options="availableCounterOptions(installedConsumer.id)"
              :model-value="getExtraMeter(installedConsumer.id) ?? null"
              @update:model-value="setExtraMeter(installedConsumer.id, $event)"
            >
              <template #help>
                Der ausgewählte Zähler überschreibt die Messwerte eines ggf. integrierten Zählers. Konfiguriert wird der
                Zähler unter "Geräte und Komponenten".
              </template>
            </openwb-base-select-input>
          </openwb-base-card>
          <hr v-if="Object.keys(installedConsumers).length > 0" />
          <openwb-base-select-input
            v-model="selectedVendor"
            title="Hersteller"
            not-selected="Bitte auswählen"
            :groups="vendorList"
          />
          <openwb-base-select-input
            v-model="consumerToAdd"
            title="Verfügbare Verbraucher"
            not-selected="Bitte auswählen"
            :disabled="selectedVendor === undefined"
            :options="consumerList"
            :model-value="consumerToAdd"
            :add-button="true"
            @update:model-value="consumerToAdd = $event"
            @input:add="addConsumer"
          >
            <template #help> Bitte einen Verbraucher auswählen, der hinzugefügt werden soll. </template>
          </openwb-base-select-input>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="consumerConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlug as fasPlug,
  faPlus as fasPlus,
  faTrash as fasTrash,
  faCog as fasCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlug, fasPlus, fasTrash, fasCog);
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbConsumerConfigProxy from "../components/consumers/OpenwbConsumerConfigProxy.vue";
import ConsumerTimeChargingPlan from "../components/consumers/ConsumerTimeChargingPlan.vue";
import ConsumerScheduledPlan from "../components/consumers/ConsumerScheduledPlan.vue";

export default {
  name: "OpenwbConsumerConfigView",
  components: {
    FontAwesomeIcon,
    OpenwbConsumerConfigProxy,
    ConsumerTimeChargingPlan,
    ConsumerScheduledPlan,
  },
  mixins: [ComponentState],
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/consumer/+/module", writeable: true },
        { topic: "openWB/consumer/+/config", writeable: true },
        { topic: "openWB/consumer/+/usage", writeable: true },
        { topic: "openWB/consumer/+/extra_meter", writeable: true },
        { topic: "openWB/system/device/+/component/+/config", writeable: false },
        { topic: "openWB/counter/get/hierarchy", writeable: false },
        { topic: "openWB/general/consumer/config/switch_on_delay", writeable: true },
        { topic: "openWB/general/consumer/config/switch_off_delay", writeable: true },
        { topic: "openWB/general/consumer/config/switch_off_threshold", writeable: true },
        { topic: "openWB/system/configurable/consumers", writeable: false },
      ],
      selectedVendor: undefined,
      consumerToAdd: undefined,
      showConsumerRemoveModal: false,
      modalConsumer: undefined,
      modalConsumerName: "",
      CONSUMER_CONFIG_FIELDS: ["connected_phases", "phase_1", "max_power"],
      commandQueue: [],
      consumerDefaultColor: "#6f42c1",
    };
  },
  computed: {
    installedConsumers() {
      const modules = this.getWildcardTopics("openWB/consumer/+/module");
      const configs = this.getWildcardTopics("openWB/consumer/+/config");
      const usages = this.getWildcardTopics("openWB/consumer/+/usage");

      return Object.fromEntries(
        Object.entries(modules).map(([moduleTopic, module]) => {
          const id = module.id;

          return [
            moduleTopic,
            {
              ...module,
              color: module.color ?? this.consumerDefaultColor,
              config: configs[`openWB/consumer/${id}/config`] ?? {},
              consumerUsage: usages[`openWB/consumer/${id}/usage`] ?? null,
            },
          ];
        }),
      );
    },
    vendorList: {
      get() {
        if (this.$store.state.mqtt["openWB/system/configurable/consumers"] === undefined) {
          return [];
        }
        const configurable = this.$store.state.mqtt["openWB/system/configurable/consumers"];
        return Object.entries(configurable)
          .map(([, group]) => {
            return {
              label: group.group_name,
              options: Object.entries(group.vendors)
                .map(([vendorKey, vendor]) => {
                  return {
                    value: vendorKey,
                    text: vendor.vendor_name,
                  };
                })
                .sort((a, b) => a.text.localeCompare(b.text)),
            };
          })
          .sort((a, b) => -a.label.localeCompare(b.label)); // reverse order to have "openWB" at the top
      },
    },
    consumerList: {
      get() {
        if (this.selectedVendor === undefined) {
          return [];
        }
        const configurable = this.$store.state.mqtt["openWB/system/configurable/consumers"];
        if (!configurable) {
          return [];
        }
        let selectedVendorData = null;
        for (const group of Object.values(configurable)) {
          if (group.vendors && group.vendors[this.selectedVendor]) {
            selectedVendorData = group.vendors[this.selectedVendor];
            break;
          }
        }
        if (!selectedVendorData || !selectedVendorData.consumers) {
          return [];
        }
        return Object.entries(selectedVendorData.consumers)
          .map(([consumerKey, consumer]) => {
            return {
              value: [this.selectedVendor, consumerKey],
              text: consumer.consumer_name,
            };
          })
          .sort((a, b) => a.text.localeCompare(b.text));
      },
    },
    componentConfigurations() {
      return this.getWildcardTopics("openWB/system/device/+/component/+/config");
    },
    // id of the EVU/grid counter (root of the counter hierarchy), which must not be selectable
    evuCounterId() {
      const hierarchy = this.$store.state.mqtt["openWB/counter/get/hierarchy"];
      if (!Array.isArray(hierarchy) || hierarchy.length === 0) return undefined;
      return hierarchy[0]?.id;
    },
    extraMeterLinks() {
      const topics = this.getWildcardTopics("openWB/consumer/+/extra_meter");
      return Object.entries(topics).map(([topic, counterId]) => {
        const match = topic.match(/openWB\/consumer\/(\d+)\/extra_meter/);
        return { consumerId: match ? parseInt(match[1]) : null, counterId };
      });
    },
    hasIntegratedCounter() {
      const result = {};
      Object.values(this.installedConsumers).forEach((consumer) => {
        result[consumer.id] = consumer?.consumerUsage?.type === "meter_only";
      });
      return result;
    },
    savingData() {
      return this.$store.state.local.savingData;
    },
  },
  watch: {
    savingData(newValue, oldValue) {
      if (newValue === false && oldValue === true) {
        // savingData changed from true to false, meaning the save operation has completed
        // process any queued commands
        while (this.commandQueue.length > 0) {
          const command = this.commandQueue.shift();
          console.debug(`Processing queued command: ${command.command}`);
          this.$emit("sendCommand", command);
        }
        // reset the preventSavingDataModal flag to allow future modals to be shown
        this.$store.commit("storeLocal", {
          name: "preventSavingModal",
          value: false,
        });
      }
    },
  },
  methods: {
    addConsumer() {
      if (!this.consumerToAdd) return;
      this.$emit("sendCommand", {
        command: "addConsumer",
        data: {
          vendor: this.consumerToAdd[0],
          type: this.consumerToAdd[1],
        },
      });
    },
    removeConsumerModal(index, name, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalConsumer = index;
      this.modalConsumerName = name;
      this.showConsumerRemoveModal = true;
    },
    removeConsumer(event) {
      this.showConsumerRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeConsumer",
          data: { consumer_id: this.modalConsumer },
        });
      }
    },
    getExtraMeter(consumerId) {
      return this.$store.state.mqtt[`openWB/consumer/${consumerId}/extra_meter`];
    },
    hasExtraMeter(consumerId) {
      return this.getExtraMeter(consumerId) != null;
    },
    setExtraMeter(consumerId, counterId) {
      this.updateState(`openWB/consumer/${consumerId}/extra_meter`, counterId ?? null);
    },
    // counters selectable for this consumer: type counter, excluding the EVU/grid
    // counter and counters already linked to another consumer
    availableCounterOptions(consumerId) {
      const linkedElsewhere = this.extraMeterLinks
        .filter((link) => link.consumerId !== consumerId && link.counterId != null)
        .map((link) => link.counterId);
      const counters = Object.values(this.componentConfigurations)
        .filter((component) => component && this.isComponentType(component.type, "counter"))
        .filter((component) => component.id !== this.evuCounterId)
        .filter((component) => !linkedElsewhere.includes(component.id))
        .map((component) => ({ value: component.id, text: component.name }))
        .sort((a, b) => a.text.localeCompare(b.text));
      // explicit selectable "none" entry so an existing link can be removed
      return [{ value: null, text: "kein Zähler" }, ...counters];
    },
    isComponentType(componentType, verifier) {
      return componentType.split("_").includes(verifier);
    },
    consumerDeviceConfiguration(consumer, event) {
      const { object, value } = event;
      const isConsumerConfigField = this.CONSUMER_CONFIG_FIELDS.includes(object);
      const targetTopic = isConsumerConfigField
        ? `openWB/consumer/${consumer.id}/config`
        : `openWB/consumer/${consumer.id}/module`;
      this.updateState(targetTopic, value, object);
    },
    showModeSettings(consumer) {
      const type = consumer.consumerUsage?.type;
      return type != null && type !== "meter_only";
    },
    updateUsage(consumerId, value, path) {
      this.updateState(`openWB/consumer/${consumerId}/usage`, value, path);
    },
    openActiveModeCard(consumerId, activeMode) {
      this.$nextTick(() => {
        const modes = ["instant_charging", "pv_charging", "eco_charging", "scheduled_charging"];
        modes.forEach((mode) => {
          const refName = `card-${consumerId}-${mode}`;
          const cardRef = this.$refs[refName];
          const card = Array.isArray(cardRef) ? cardRef[0] : cardRef;
          if (card) {
            card.isCollapsed = mode !== activeMode;
          }
        });
      });
    },
    // reset_chargemode.time is stored as an absolute epoch (seconds). Split it into
    // the date/time strings the inputs expect, defaulting to "now" when unset.
    resetDateParts(consumer) {
      const epoch = consumer.consumerUsage?.reset_chargemode?.time;
      const date = epoch ? new Date(epoch * 1000) : new Date();
      const pad = (dateTimePart) => String(dateTimePart).padStart(2, "0");
      return {
        date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
        time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
      };
    },
    setResetDate(consumer, dateString) {
      this.writeResetTime(consumer.id, dateString, this.resetDateParts(consumer).time);
    },
    setResetTime(consumer, timeString) {
      this.writeResetTime(consumer.id, this.resetDateParts(consumer).date, timeString);
    },
    writeResetTime(consumerId, dateString, timeString) {
      if (!dateString || !timeString) return;
      const epoch = Math.floor(new Date(`${dateString}T${timeString}`).getTime() / 1000);
      if (Number.isNaN(epoch)) return;
      this.updateUsage(consumerId, epoch, "reset_chargemode.time");
    },
    commandAfterSavingConsumerUsage(command, data, hideSaveModal = false) {
      this.commandQueue.push({ command, data });
      if (hideSaveModal) {
        console.debug(`Hiding save modal before executing command: ${command}`);
        this.$store.commit("storeLocal", {
          name: "preventSavingModal",
          value: true,
        });
      }
      console.debug(`Saving consumer usage data before executing command: ${command}`);
      this.$emit("save", [`openWB/consumer/${data.consumer_id}/usage`]);
    },
  },
};
</script>
