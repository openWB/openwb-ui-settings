<template>
  <openwb-base-modal-dialog
    :show="showRemoveModal"
    title="Zeitladen Zeitplan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removePlan"
  >
    Wollen Sie den Zeitladen Zeitplan "{{ plan.name }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
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
          {{ plan.limit.soc }}%
        </span>
        <span v-if="plan.limit.selected == 'amount'">
          <font-awesome-icon :icon="['fas', 'bolt']" />
          {{ plan.limit.amount / 1000 }}kWh
        </span>
        <font-awesome-icon :icon="['fas', 'clock']" />
        {{ plan.time[0] }} - {{ plan.time[1] }}
        <span v-if="plan.frequency.selected == 'once'">
          <font-awesome-icon :icon="['fas', 'calendar-day']" />
          {{
            formatDate(plan.frequency.once[0]) == formatDate(plan.frequency.once[1])
              ? formatDate(plan.frequency.once[0])
              : formatDate(plan.frequency.once[0]) + " - " + formatDate(plan.frequency.once[1])
          }}
        </span>
        <span v-if="plan.frequency.selected == 'daily'">
          <font-awesome-icon :icon="['fas', 'calendar-week']" />
        </span>
        <span v-if="plan.frequency.selected == 'weekly'">
          <font-awesome-icon :icon="['fas', 'calendar-alt']" />
        </span>
      </span>
      <span v-if="slotProps.collapsed == false">
        <openwb-base-avatar
          class="bg-success clickable"
          title="Zeitladen-Plan duplizieren"
          @click.stop="copyPlan()"
        >
          <font-awesome-icon :icon="['fas', 'copy']" />
        </openwb-base-avatar>
        <openwb-base-avatar
          class="bg-danger clickable ml-1"
          title="Zeitladen-Plan löschen"
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
    />
    <openwb-base-range-input
      v-model="plan.current"
      :title="`Ladestrom${dcChargingEnabled ? ' (AC)' : ''}`"
      :min="6"
      :max="32"
      :step="1"
      unit="A"
    />
    <openwb-base-number-input
      v-if="dcChargingEnabled === true"
      title="Ladeleistung (DC)"
      unit="kW"
      :min="0"
      :model-value="ac_current2dc_power(plan.dc_current)"
      @update:model-value="plan.dc_current = dc_power2ac_current($event)"
    />
    <openwb-base-button-group-input
      v-model="plan.limit.selected"
      title="Begrenzung"
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
    >
      <template #help> Bestimmt die Art der Grenze für den Ladevorgang. </template>
    </openwb-base-button-group-input>
    <openwb-base-range-input
      v-model="plan.limit.soc"
      title="Ziel-SoC für das Fahrzeug"
      :min="5"
      :max="100"
      :step="5"
      unit="%"
    >
      <template #help>
        Ladestand des Akku (State of Charge, SoC), bis zu welchem maximal geladen werden soll.
      </template>
    </openwb-base-range-input>
    <openwb-base-number-input
      title="Ziel-Energie"
      unit="kWh"
      :min="1"
      :step="0.5"
      :model-value="plan.limit.amount / 1000"
      @update:model-value="plan.limit.amount = $event * 1000"
    >
      <template #help>
        Maximal zu ladende Energie innerhalb des Zeitfensters. Eignet sich immer dann wenn kein SoC zur Verfügung steht.
        Die geladene Energiemenge wird beim Wechsel des Lademodus, Wechsel des Plans oder nach dem Anstecken, wenn
        Zeitladen schon aktiv ist, neu gezählt.
      </template>
    </openwb-base-number-input>
    <hr />
    <openwb-base-text-input
      v-model="plan.time[0]"
      title="Zeitpunkt des Ladebeginns"
      subtype="time"
    />
    <openwb-base-text-input
      v-model="plan.time[1]"
      title="Zeitpunkt des Ladeendes"
      subtype="time"
    />
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
      v-model="plan.frequency.once[0]"
      title="Gültig ab"
      subtype="date"
    />
    <openwb-base-text-input
      v-if="plan.frequency.selected == 'once'"
      v-model="plan.frequency.once[1]"
      title="Gültig bis"
      subtype="date"
      :min="plan.frequency.once[0]"
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
      v-model="plan.phases_to_use"
      title="Anzahl Phasen"
      :buttons="[
        { buttonValue: 1, text: '1' },
        { buttonValue: 3, text: 'Maximum' },
      ]"
    >
      <template #help>
        Hier kann eingestellt werden, ob Ladevorgänge mit einer Phase oder dem möglichen Maximum in Abhängigkeit der
        "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Voraussetzung ist die verbaute
        Umschaltmöglichkeit zwischen 1- und 3-phasig (sog. 1p3p).
      </template>
    </openwb-base-button-group-input>
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
  faCopy as fasCopy,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCarBattery, fasBolt, fasClock, fasCalendarDay, fasCalendarWeek, fasCalendarAlt, fasCopy, fasTrash);

import ComponentState from "/src/components/mixins/ComponentState.vue";

export default {
  name: "ChargeTemplateTimeChargingPlan",
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
      mqttTopicsToSubscribe: ["openWB/optional/dc_charging"],
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
        command: "addChargeTemplateTimeChargingPlan",
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
          command: "removeChargeTemplateTimeChargingPlan",
          data: { template: this.templateId, plan: this.modelValue.id, changed_in_theme: false },
        });
      }
    },
  },
};
</script>
