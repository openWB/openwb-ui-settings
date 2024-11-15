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
      return parseFloat(((current * 3 * 230) / 1000).toFixed(2));
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
      return (value * scale).toLocaleString(undefined, {
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
  },
};
</script>
