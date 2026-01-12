<template>
  <openwb-base-modal-dialog
    :show="showRemoveModal"
    title="Autolock Zeitplan löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removePlan"
  >
    Willst Du den Autolock Zeitplan "{{ plan.name }}" wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht
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
        {{ plan.time[0] }} -
        {{ plan.time[1] }}
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
          title="Autolock Zeitplan duplizieren"
          @click.stop="copyPlan()"
        >
          <font-awesome-icon :icon="['fas', 'copy']" />
        </openwb-base-avatar>
        <openwb-base-avatar
          class="bg-danger clickable ml-1"
          title="Autolock Zeitplan löschen"
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
    <openwb-base-text-input
      v-model="plan.time[0]"
      title="Sperren um"
      subtype="time"
    />
    <openwb-base-text-input
      v-model="plan.time[1]"
      title="Freigeben um"
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
      title="Sperren ab ..."
      subtype="date"
    />
    <openwb-base-text-input
      v-if="plan.frequency.selected == 'once'"
      v-model="plan.frequency.once[1]"
      title="... bis"
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
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash as fasTrash,
  faCopy as fasCopy,
  faCalendarDay as fasCalendarDay,
  faCalendarAlt as fasCalendarAlt,
  faCalendarWeek as fasCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasTrash, fasCopy, fasCalendarDay, fasCalendarAlt, fasCalendarWeek);

import ComponentState from "../mixins/ComponentState.vue";

export default {
  name: "TemplateAutoLockPlan",
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
  },
  emits: ["update:modelValue", "sendCommand"],
  data() {
    return {
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
        command: "addAutolockPlan",
        data: { template: this.templateId, copy: this.modelValue.id },
      });
    },
    removePlanModal() {
      this.showRemoveModal = true;
    },
    removePlan(event) {
      this.showRemoveModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeAutolockPlan",
          data: { template: this.templateId, plan: this.modelValue.id },
        });
      }
    },
  },
};
</script>
