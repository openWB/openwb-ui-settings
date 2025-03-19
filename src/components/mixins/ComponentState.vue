<script>
export default {
  name: "ComponentState",
  emits: ["reset", "defaults", "save"],
  data() {
    return {
      mqttTopicsToSubscribe: [],
    };
  },
  computed: {
    weekdays() {
      return ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    },
    chargeModes() {
      return ["instant_charging", "pv_charging", "scheduled_charging", "time_charging", "standby", "stop"];
    },
    statusLevel() {
      return ["success", "warning", "danger"];
    },
    stateIcon: {
      get() {
        switch (this.$store.state.mqtt[this.baseTopic + "/get/fault_state"]) {
          case 0:
            return ["fas", "check-circle"];
          case 1:
            return ["fas", "exclamation-triangle"];
          case 2:
            return ["fas", "times-circle"];
          default:
            return ["fas", "check-circle"];
        }
      },
    },
  },
  mounted() {
    if (this.mqttTopicsToSubscribe.length > 0) {
      this.$root.doSubscribe(this.mqttTopicsToSubscribe);
    }
  },
  unmounted() {
    if (this.mqttTopicsToSubscribe.length > 0) {
      this.$root.doUnsubscribe(this.mqttTopicsToSubscribe);
    }
  },
  methods: {
    updateState(topic, value, objectPath = undefined) {
      console.debug("updateState:", topic, value, objectPath);
      this.$store.commit({
        type: "updateTopic",
        topic: topic,
        objectPath: objectPath,
        payload: value,
      });
    },
    ac_current2dc_power(current) {
      return parseFloat(((current * 3 * 230) / 1000).toFixed(0));
    },
    dc_power2ac_current(power) {
      return parseFloat(((power * 1000) / 230 / 3).toFixed(2));
    },
    getWildcardIndexList(baseTopic, isRegex = false) {
      let baseTopicRegex = baseTopic;
      if (!isRegex) {
        // build a valid regex based on the provided wildcard topic
        baseTopicRegex =
          "^" + baseTopic.replaceAll("/", "\\/").replaceAll("+", "[^+/]+").replaceAll("#", "[^#/]+") + "$";
      }
      // filter and return all topics matching our regex
      let myTopics = Object.keys(this.$store.state.mqtt).filter((key) => {
        return key.match(baseTopicRegex);
      });
      myTopics.forEach((topic, index, array) => {
        array[index] = parseInt(topic.match(/(?:\/)([0-9]+)(?=\/)*/g)[0].replace(/[^0-9]+/g, ""));
      });
      return myTopics;
    },
    getWildcardTopics(baseTopic, isRegex = false) {
      let baseTopicRegex = baseTopic;
      if (!isRegex) {
        // build a valid regex based on the provided wildcard topic
        baseTopicRegex =
          "^" + baseTopic.replaceAll("/", "\\/").replaceAll("+", "[^+/]+").replaceAll("#", "[^#/]+") + "$";
      }
      // filter and return all topics matching our regex
      return Object.keys(this.$store.state.mqtt)
        .filter((key) => {
          return key.match(baseTopicRegex);
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: this.$store.state.mqtt[key],
          };
        }, {});
    },
    formatDate(dateString, format = { year: "numeric", month: "2-digit", day: "2-digit" }) {
      let date = new Date(dateString);
      return date.toLocaleDateString(undefined, format);
    },
    formatNumber(value, minNumDigits = 0, maxNumDigit = minNumDigits, scale = 1) {
      if (value == undefined || isNaN(value)) {
        return undefined;
      }
      value = value * scale;
      // if (value >= 1000) {
      //   minNumDigits = 0;
      //   maxNumDigit = 0;
      // } else if (value >= 10 && minNumDigits > 1) {
      //   minNumDigits = 1;
      //   maxNumDigit = 1;
      // } else if (value >= 1 && minNumDigits > 2) {
      //   minNumDigits = 2;
      //   maxNumDigit = 2;
      // }

      return value.toLocaleString(undefined, {
        minimumFractionDigits: minNumDigits,
        maximumFractionDigits: maxNumDigit,
      });
    },
    formatNumberTopic(topic, minNumDigits = 0, maxNumDigits = minNumDigits, scale = 1) {
      if (this.$store.state.mqtt[topic]) {
        return this.formatNumber(this.$store.state.mqtt[topic], minNumDigits, maxNumDigits, scale);
      } else {
        return "-";
      }
    },
    formatPhaseArrayNumberTopic(topic, minNumDigits = 0, maxNumDigits = minNumDigits, scale = 1) {
      if (this.$store.state.mqtt[topic]) {
        return this.$store.state.mqtt[topic]
          .map((element) => {
            return this.formatNumber(element, minNumDigits, maxNumDigits, scale);
          })
          .join(" / ");
      } else {
        return "- / - / -";
      }
    },
    translateChargeMode(value) {
      switch (value) {
        case "instant_charging":
          return "Sofort";
        case "pv_charging":
          return "PV";
        case "scheduled_charging":
          return "Zielladen";
        case "time_charging":
          return "Zeitladen";
        case "standby":
          return "Standby";
        case "stop":
          return "Stop";
        default:
          console.warn("unknown charge mode:", value);
          return value;
      }
    },
    getFaultStateSubtype(baseTopic) {
      const faultState = this.$store.state.mqtt[baseTopic + "/get/fault_state"];

      if (faultState === undefined) {
        return "warning"; // Handle undefined case
      }

      switch (faultState) {
        case 0:
          return "success";
        case 1:
          return "warning";
        case 2:
          return "danger";
        default:
          return "dark"; // Default case for all other values
      }
    },
  },
};
</script>
