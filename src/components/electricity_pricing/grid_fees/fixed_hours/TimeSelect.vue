<template>
  <div class="form-row">
    <div class="col-6">
      <select
        class="form-control"
        required
        :value="hour"
        @change="selectHour($event.target.value)"
      >
        <option
          value=""
          disabled
        >
          --
        </option>
        <option
          v-for="option in hourOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <div class="col-6">
      <select
        class="form-control"
        required
        :value="minute"
        :disabled="hour === ''"
        @change="selectMinute($event.target.value)"
      >
        <option
          v-for="option in minuteOptions(hour)"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
const MINUTES = ["00", "15", "30", "45"];

export default {
  name: "TimeSelect",
  props: {
    modelValue: { type: String, default: "" },
    // the selected time must be later than this one ("HH:MM")
    after: { type: String, default: "" },
    maxHour: { type: Number, default: 23 },
  },
  emits: ["update:modelValue"],
  computed: {
    hour() {
      return this.modelValue.slice(0, 2);
    },
    minute() {
      return this.modelValue.slice(3, 5);
    },
    hourOptions() {
      const options = [];
      for (let hour = 0; hour <= this.maxHour; hour++) {
        const hourString = hour.toString().padStart(2, "0");
        if (this.minuteOptions(hourString).length > 0) {
          options.push(hourString);
        }
      }
      return options;
    },
  },
  methods: {
    minuteOptions(hour) {
      if (hour === "") {
        return MINUTES;
      }
      if (hour === "24") {
        return ["00"];
      }
      return MINUTES.filter((minute) => `${hour}:${minute}` > this.after);
    },
    selectHour(hour) {
      const minutes = this.minuteOptions(hour);
      const minute = minutes.includes(this.minute) ? this.minute : minutes[0];
      this.$emit("update:modelValue", `${hour}:${minute}`);
    },
    selectMinute(minute) {
      this.$emit("update:modelValue", `${this.hour}:${minute}`);
    },
  },
};
</script>
