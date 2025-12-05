<template>
  <openwb-base-modal-dialog
    :show="showRemoveModal"
    title="Zielladen Zeitplan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removePlan"
  >
    Wollen Sie den Zielladen Zeitplan "{{ plan.name }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
    werden!
  </openwb-base-modal-dialog>
  <openwb-base-card
    :title="plan.name"
    :collapsible="true"
    :collapsed="true"
  >
    <template #actions="slotProps">
      <span
        v-if="slotProps.collapsed == true"
        class="pill clickable"
        :class="plan.active ? 'bg-success' : 'bg-danger'"
        @click.stop="plan.active = !plan.active"
      >
        <span v-if="plan.limit.selected == 'soc'">
          <font-awesome-icon :icon="['fas', 'car-battery']" />
          {{ plan.limit.soc_scheduled }}%
          <font-awesome-icon :icon="['fas', plan.bidi_charging_enabled ? 'right-left' : 'right-long']" />
          {{ plan.limit.soc_limit }}%
        </span>
        <span v-if="plan.limit.selected == 'amount'">
          <font-awesome-icon :icon="['fas', 'bolt']" />
          {{ plan.limit.amount / 1000 }}kWh
        </span>
        <font-awesome-icon :icon="['fas', 'clock']" />
        {{ plan.time }}
        <span v-if="plan.frequency.selected == 'once'">
          <font-awesome-icon :icon="['fas', 'calendar-day']" />
          {{ formatDate(plan.frequency.once) }}
        </span>
        <span v-if="plan.frequency.selected == 'daily'">
          <font-awesome-icon :icon="['fas', 'calendar-week']" />
        </span>
        <span v-if="plan.frequency.selected == 'weekly'">
          <font-awesome-icon :icon="['fas', 'calendar-alt']" />
        </span>
        <span v-if="plan.et_active">
          <font-awesome-icon :icon="['fas', 'coins']" />
        </span>
      </span>
      <span v-if="slotProps.collapsed == false">
        <openwb-base-avatar
          class="bg-success clickable ml-1"
          title="Zielladen-Plan duplizieren"
          @click.stop="copyPlan()"
        >
          <font-awesome-icon :icon="['fas', 'copy']" />
        </openwb-base-avatar>
        <openwb-base-avatar
          class="bg-danger clickable ml-1"
          title="Zielladen-Plan löschen"
          @click.stop="removePlanModal()"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
        </openwb-base-avatar>
      </span>
    </template>
    <openwb-base-text-input
      v-model="plan.name"
      title="Bezeichnung"
    />
    <openwb-base-button-group-input
      v-model="plan.active"
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
    />
    <openwb-base-text-input
      v-model="plan.time"
      title="Ziel-Uhrzeit"
      subtype="time"
    >
      <template #help>
        Hier ist die gewünschte Uhrzeit einzustellen, zu welcher das Fahrzeug den gewünschten SoC bzw. die zu ladende
        Energiemenge BEREITS ERREICHT haben soll.
      </template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      v-model="plan.limit.selected"
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
    >
      <template #help> Bestimmt die Art der Grenze für den Ladevorgang. </template>
    </openwb-base-button-group-input>
    <openwb-base-range-input
      v-if="plan.limit.selected == 'soc'"
      v-model="plan.limit.soc_scheduled"
      title="Fahrzeug-SoC zum Zielzeitpunkt"
      :min="5"
      :max="100"
      :step="5"
      unit="%"
    >
      <template #help> SoC, der zum angegebenen Zeitpunkt erreicht werden soll (Ziel-SoC). </template>
    </openwb-base-range-input>
    <openwb-base-range-input
      v-if="plan.limit.selected == 'soc'"
      v-model="plan.limit.soc_limit"
      title="Fahrzeug-SoC mit Überschuss"
      :min="5"
      :max="100"
      :step="5"
      unit="%"
    >
      <template #help>
        Nach Erreichen des Ziel-SoCs wird mit Überschuss weiter geladen, bis das SoC-Limit erreicht wird. Sobald das
        SoC-Limit erreicht wurde, findet keine Ladung mehr mit Überschuss statt!
      </template>
    </openwb-base-range-input>
    <openwb-base-number-input
      v-if="plan.limit.selected == 'amount'"
      title="Ziel-Energie"
      unit="kWh"
      :min="1"
      :step="0.5"
      :model-value="plan.limit.amount / 1000"
      @update:model-value="plan.limit.amount = $event * 1000"
    >
      <template #help>
        Die geladene Energiemenge wird beim Wechsel des Lademodus, Wechsel des Plans oder nach dem Anstecken, wenn
        Zielladen schon ausgewählt ist, neu gezählt.
      </template>
    </openwb-base-number-input>
    <hr />
    <openwb-base-button-group-input
      v-model="plan.frequency.selected"
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
    />
    <openwb-base-text-input
      v-if="plan.frequency.selected == 'once'"
      v-model="plan.frequency.once"
      title="Datum"
      subtype="date"
    />
    <div v-if="plan.frequency.selected == 'weekly'">
      <openwb-base-button-group-input
        v-for="(day, dayIndex) in weekdays"
        :key="dayIndex"
        v-model="plan.frequency.weekly[dayIndex]"
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
      />
    </div>
    <hr />
    <openwb-base-button-group-input
      v-model="plan.et_active"
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
    />
    <openwb-base-alert
      v-if="
        plan.et_active == true &&
        (!$store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'] ||
          !$store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'].type)
      "
      subtype="danger"
    >
      Bitte in den übergreifenden Ladeeinstellungen einen Strompreis-Anbieter konfigurieren.
    </openwb-base-alert>
    <openwb-base-button-group-input
      v-model="plan.phases_to_use"
      title="Anzahl Phasen Zielladen"
      :buttons="[
        { buttonValue: 1, text: '1' },
        { buttonValue: 3, text: 'Maximum' },
        { buttonValue: 0, text: 'Automatik' },
      ]"
    >
      <template #help>
        Hier kann eingestellt werden, ob Ladevorgänge im Modus "Zielladen" mit nur einer Phase oder dem möglichen
        Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus "Automatik"
        entscheidet die Regelung, welche Einstellung genutzt wird, um das Ziel zu erreichen. Voraussetzung ist die
        verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (sog. 1p3p).
      </template>
    </openwb-base-button-group-input>
    <openwb-base-button-group-input
      v-model="plan.phases_to_use_pv"
      title="Anzahl Phasen bei PV-Überschuss"
      :buttons="[
        { buttonValue: 1, text: '1' },
        { buttonValue: 3, text: 'Maximum' },
        { buttonValue: 0, text: 'Automatik' },
      ]"
    >
      <template #help>
        Hier kann eingestellt werden, ob Ladevorgänge im Modus "Zielladen" bei Laden mit PV-Überschuss mit nur einer
        Phase oder dem möglichen Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt
        werden. Im Modus "Automatik" entscheidet die Regelung, welche Einstellung genutzt wird, um das Ziel zu
        erreichen. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (sog. 1p3p).
      </template>
    </openwb-base-button-group-input>
    <openwb-base-range-input
      v-model="plan.current"
      :title="`Ladestrom${dcChargingEnabled ? ' (AC)' : ''}`"
      :min="6"
      :max="32"
      :step="1"
      unit="A"
    >
      <template #help>
        Mit dieser Stromstärke wird der Zeitpunkt berechnet, wann die Ladung mit Netzbezug gestartet werden muss. Wird
        der Ziel-SoC nicht zum angegebenen Termin erreicht, weil z.B. das Auto erst später angesteckt wurde, wird auch
        mit einer höheren Stromstärke geladen. Um etwas Puffer zu haben, empfiehlt es sich, etwas weniger als die
        Maximalstromstärke des Fahrzeugs zu wählen.
      </template>
    </openwb-base-range-input>
    <openwb-base-number-input
      v-if="dcChargingEnabled === true"
      title="Ladeleistung (DC)"
      unit="kW"
      :min="0"
      :model-value="ac_current2dc_power(plan.dc_current)"
      @update:model-value="plan.dc_current = dc_power2ac_current($event)"
    />
    <div v-if="plan.limit.selected == 'soc'">
      <hr />
      <openwb-base-button-group-input
        v-model="plan.bidi_charging_enabled"
        title="Bidirektionales Überschussladen bei kompatiblem Ladepunkt&Fahrzeug"
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
      >
        <template #help>
          Wenn Ladepunkt und Fahrzeug bidirektionales Laden unterstützen, wird bis zum Fahrzug-SoC zum Zielzeitpunkt wie
          gewohnt mit Zielladen geladen. Ist der eingestellte SoC erreicht, wird eine Nullpunktausregelung gemacht, dh
          das Auto wird so ge- und entladen, dass möglichst weder Bezug noch Einspeisung entsteht. Der SoC wird dabei
          immer zwischen Fahrzeug-SoC zum Zielzeitpunkt und Fahrzeug-SoC mit Überschuss gehalten. <br />
          Unterstützen das Fahrzeug und/oder der Ladepunkt kein bidirektionales Laden, hat diese Einstellung keine
          Auswirkung.
        </template>
      </openwb-base-button-group-input>
      <openwb-base-alert
        v-if="plan.bidi_charging_enabled === true"
        subtype="info"
      >
        Die Norm IEC 61851-1 und ISO 15118 benötigen als Parameter eine Stromstärke und die Phasenzahl. Die Norm ISO
        15118-20, die das bidirektionale Laden definiert, benötigt als Parameter eine Ladeleistung. Die Phasenzahl legt
        das Fahrzeug fest. Wenn Fahrzeug und Ladepunkt bidirektionales Laden nach ISO 15118-20 unterstützen, wird die
        eingestellte Ladeleistung verwendet. Unterstützen das Fahrzeug und/oder der Ladepunkt die Norm nicht, wird der
        Ladestrom und die vorgegebene Phasenzahl angewendet.
      </openwb-base-alert>
      <openwb-base-number-input
        v-if="plan.bidi_charging_enabled === true"
        title="Ladeleistung"
        :min="1"
        :max="22"
        :step="0.5"
        unit="kW"
        :model-value="plan.bidi_power / 1000"
        @update:model-value="updateState(templateKey, $event * 1000, 'plan.bidi_power')"
      >
      </openwb-base-number-input>
    </div>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCarBattery as fasCarBattery,
  faBolt as fasBolt,
  faClock as fasClock,
  faCalendarDay as fasCalendarDay,
  faCalendarWeek as fasCalendarWeek,
  faCalendarAlt as fasCalendarAlt,
  faCoins as fasCoins,
  faRightLong as fasRightLong,
  faRightLeft as fasRightLeft,
  faCopy as fasCopy,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasCarBattery,
  fasBolt,
  fasClock,
  fasCalendarDay,
  fasCalendarWeek,
  fasCalendarAlt,
  fasRightLong,
  fasRightLeft,
  fasCoins,
  fasCopy,
  fasTrash,
);

import ComponentState from "/src/components/mixins/ComponentState.vue";

export default {
  name: "VehicleScheduledChargingPlan",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    templateId: {
      type: Number,
      required: true,
    },
    dcChargingEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/optional/ep/flexible_tariff/provider"],
      showRemoveModal: false,
    };
  },
  computed: {
    plan() {
      return this.modelValue;
    },
  },
  watch: {
    plan: {
      handler(newValue) {
        this.$emit("update:modelValue", newValue);
      },
      deep: true,
    },
  },
  methods: {
    copyPlan() {
      this.$emit("sendCommand", {
        command: "addChargeTemplateSchedulePlan",
        data: { template: this.templateId, changed_in_theme: false, copy: this.modelValue.id },
      });
    },
    removePlanModal() {
      this.showRemoveModal = true;
    },
    removePlan(event) {
      this.showRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeChargeTemplateSchedulePlan",
          data: { template: this.templateId, plan: this.modelValue.id, changed_in_theme: false },
        });
      }
    },
  },
};
</script>
