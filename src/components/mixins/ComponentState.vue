<script>
export default {
  name: "ComponentState",
  emits: ["reset", "defaults", "save"],
  data() {
    return {
      mqttTopics: [],
      weekdays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
      chargeModes: ["instant_charging", "pv_charging", "scheduled_charging", "time_charging", "eco_charging", "stop"],
      statusLevel: ["success", "warning", "danger"],
    };
  },
  computed: {
    mqttTopicsToSubscribe() {
      return this.mqttTopics.map((topic) => topic.topic);
    },
    mqttTopicsToPublish() {
      return this.mqttTopics.filter((topic) => topic.writeable).map((topic) => topic.topic);
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
        return this.$store.state.mqtt[topic].map((element) => {
          return this.formatNumber(element, minNumDigits, maxNumDigits, scale);
        });
      } else {
        return ["-", "-", "-"];
      }
    },
    translateChargeMode(value) {
      const chargeModeTranslations = {
        instant_charging: "Sofort",
        pv_charging: "PV",
        scheduled_charging: "Zielladen",
        time_charging: "Zeitladen",
        eco_charging: "Eco",
        standby: "Standby", // keep for backward compatibility!
        stop: "Stop",
      };
      return chargeModeTranslations[value] || value;
    },
  },
};
</script>
