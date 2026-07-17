<template>
  <openwb-base-modal-dialog
    :show="showRemoveModal"
    title="Zielladen-Plan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removePlan"
  >
    Willst Du den Zielladen-Plan "{{ plan.name }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
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
      </span>
      <span v-if="slotProps.collapsed == false">
        <openwb-base-avatar
          class="bg-success clickable"
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
      title="Plan aktiv"
      :buttons="[
        { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
        { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
      ]"
    />
    <openwb-base-text-input
      v-model="plan.time[0]"
      title="Zeitfenster Beginn"
      subtype="time"
    />
    <openwb-base-text-input
      v-model="plan.time[1]"
      title="Zeitfenster Ende"
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
    <openwb-base-number-input
      v-if="plan.duration !== undefined"
      title="Gesamtlaufzeit"
      unit="min"
      :min="0"
      :step="1"
      :model-value="plan.duration / 60"
      @update:model-value="plan.duration = $event * 60"
    >
      <template #help> Gesamte Laufzeit eines Programm-Durchlaufs des Geräts. </template>
    </openwb-base-number-input>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faClock as fasClock,
  faCalendarDay as fasCalendarDay,
  faCalendarWeek as fasCalendarWeek,
  faCalendarAlt as fasCalendarAlt,
  faCopy as fasCopy,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasClock, fasCalendarDay, fasCalendarWeek, fasCalendarAlt, fasCopy, fasTrash);

import ComponentState from "../mixins/ComponentState.vue";

export default {
  name: "ConsumerScheduledPlan",
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
  },
  methods: {
    copyPlan() {
      this.$emit("sendCommand", {
        command: "addConsumerSchedulePlan",
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
          command: "removeConsumerSchedulePlan",
          data: { consumer_id: this.consumerId, plan: this.modelValue.id },
        });
      }
    },
  },
};
</script>
