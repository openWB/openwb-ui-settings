<template>
  <openwb-base-modal-dialog
    :show="showRemoveModal"
    title="Zeitladen-Plan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removePlan"
  >
    Willst Du den Zeitladen-Plan "{{ plan.name }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
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
        <font-awesome-icon :icon="['fas', 'clock']" />
        {{ plan.time[0] }} - {{ plan.time[1] }}
        <span v-if="plan.frequency.selected == 'once'">
          <font-awesome-icon :icon="['fas', 'calendar-day']" />
        </span>
        <span v-if="plan.frequency.selected == 'daily'">
          <font-awesome-icon :icon="['fas', 'calendar-week']" />
        </span>
        <span v-if="plan.frequency.selected == 'weekly'">
          <font-awesome-icon :icon="['fas', 'calendar-alt']" />
        </span>
        <span v-if="plan.min_bat_soc != null">
          <font-awesome-icon :icon="['fas', 'car-battery']" />
          {{ plan.min_bat_soc }}%
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
        { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
        { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
      ]"
    />
    <openwb-base-text-input
      v-model="plan.time[0]"
      title="Zeitpunkt des Einschaltens"
      subtype="time"
    />
    <openwb-base-text-input
      v-model="plan.time[1]"
      title="Zeitpunkt des Ausschaltens"
      subtype="time"
    />
    <openwb-base-button-group-input
      v-model="plan.frequency.selected"
      title="Wiederholungen"
      :buttons="[
        { buttonValue: 'once', text: 'Einmalig', class: 'btn-outline-info' },
        { buttonValue: 'daily', text: 'Täglich', class: 'btn-outline-info' },
        { buttonValue: 'weekly', text: 'Wöchentlich', class: 'btn-outline-info' },
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
          { buttonValue: false, text: 'Aus', class: 'btn-outline-danger' },
          { buttonValue: true, text: 'An', class: 'btn-outline-success' },
        ]"
      />
    </div>
    <hr />
    <openwb-base-range-input
      v-model="plan.min_bat_soc"
      title="Zeitladen bis Speicher entladen auf"
      :min="0"
      :max="minBatSocLabels.length - 1"
      :step="1"
      unit="%"
      :labels="minBatSocLabels"
    >
      <template #help>
        Zeitladen wird nur ausgeführt, solange der Speicher-SoC über diesem Wert liegt. Bei „Aus" wird der Speicher-SoC
        nicht berücksichtigt. Lädt die aktive Speichersteuerung gerade den Speicher, wird kein Zeitladen gestartet, da
        der Speicher nicht gleichzeitig geladen und entladen werden kann.
      </template>
    </openwb-base-range-input>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCarBattery as fasCarBattery,
  faClock as fasClock,
  faCalendarDay as fasCalendarDay,
  faCalendarWeek as fasCalendarWeek,
  faCalendarAlt as fasCalendarAlt,
  faCopy as fasCopy,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCarBattery, fasClock, fasCalendarDay, fasCalendarWeek, fasCalendarAlt, fasCopy, fasTrash);

import ComponentState from "../mixins/ComponentState.vue";

export default {
  name: "ConsumerTimeChargingPlan",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    consumerId: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:modelValue", "sendCommand"],
  data() {
    return {
      mqttTopics: [],
      showRemoveModal: false,
    };
  },
  computed: {
    plan() {
      return this.modelValue;
    },
    minBatSocLabels() {
      const labels = [{ label: "Aus", value: null }];
      for (let value = 5; value <= 95; value += 5) {
        labels.push({ label: value, value: value });
      }
      return labels;
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
        command: "addConsumerTimePlan",
        data: { consumer_id: this.consumerId, copy: this.modelValue.id },
      });
    },
    removePlanModal() {
      this.showRemoveModal = true;
    },
    removePlan(event) {
      this.showRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeConsumerTimePlan",
          data: { consumer_id: this.consumerId, plan: this.modelValue.id },
        });
      }
    },
  },
};
</script>
