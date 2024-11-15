import { createStore } from "vuex";

let states = {
  mqtt: {}, // will be filled with mqtt data
  mqttSubscriptions: {}, // will be filled with mqtt subscriptions count
  local: {
    reloadRequired: false,
    savingData: false,
  },
  text: {
    rfidWiki:
      "Bitte auch hiervon abhängige Einstellungen beachten. Eine Übersicht gibt es im " +
      '<a href="https://github.com/openWB/core/wiki/Ladung-nur-nach-Freischaltung" ' +
      'target="_blank" rel="noopener noreferrer">Wiki</a>.',
  },
};

/* examples start here */
if (import.meta.env.MODE !== "production") {
  states["examples"] = {
    text1: "Text...",
    text2: "mail@domain.com",
    text3: "openwb.local",
    text4: "http://www.openwb.de",
    text5: "Benutzername",
    text6: "12:34",
    text7: "2021-10-31",
    number1: 5,
    number2: 10,
    number3: 0.00028,
    password1: "GeHeiM!",
    textarea1: "Langer Text...",
    range1: 6,
    range2: 10,
    select1: 1,
    select2: undefined,
    buttonGroup1: 1,
    checkbox1: true,
    json1: { text: "Text", number: 123 },
    hierarchy1: [
      {
        id: 0,
        type: "counter",
        children: [
          {
            id: 3,
            type: "inverter",
            children: [],
          },
          {
            id: 4,
            type: "bat",
            children: [],
          },
          {
            id: 1,
            type: "cp",
            children: [],
          },
          {
            id: 2,
            type: "cp",
            children: [],
          },
        ],
      },
    ],
    hierarchy1Labels: {
      0: "EVU",
      1: "Ladepunkt 1",
      2: "Ladepunkt 2",
      3: "Wechselrichter",
      4: "Batteriespeicher",
    },
    tags: ["1234", "2345", "3456"],
  };
}

export default createStore({
  // strict: process.env.NODE_ENV !== "production",
  state: states,
  mutations: {
    storeLocal(state, message) {
      state.local[message.name] = message.value;
    },
    addTopic(state, message) {
      // prevent overwriting data with multiple subscriptions
      if (!Object.keys(state.mqtt).includes(message.topic)) {
        state.mqtt[message.topic] = message.payload;
      } else {
        console.warn("topic already exists: ", message.topic);
      }
    },
    removeTopic(state, topic) {
      delete state.mqtt[topic];
    },
    updateTopic(state, message) {
      // helper function to update nested objects py path
      const setPath = (object, path, value) =>
        path.split(".").reduce((o, p, i) => (o[p] = path.split(".").length === ++i ? value : o[p] || {}), object);

      if (message.topic in state.mqtt || !(message.topic in state.examples)) {
        if (message.objectPath != undefined) {
          setPath(state.mqtt[message.topic], message.objectPath, message.payload);
        } else {
          state.mqtt[message.topic] = message.payload;
        }
      } else {
        console.debug("topic not found in state.mqtt: ", message.topic);
        if (message.topic in state.examples) {
          if (message.objectPath != undefined) {
            setPath(state.examples[message.topic], message.objectPath, message.payload);
          } else {
            state.examples[message.topic] = message.payload;
          }
        } else {
          console.warn("topic not found in state: ", message.topic, " giving up");
        }
      }
    },
    addSubscription(state, topic) {
      // add subscription to list or increment count
      if (topic in state.mqttSubscriptions) {
        state.mqttSubscriptions[topic] += 1;
      } else {
        state.mqttSubscriptions[topic] = 1;
      }
      console.debug("subscription count: ", topic, state.mqttSubscriptions[topic]);
    },
    removeSubscription(state, topic) {
      // remove subscription from list or decrement count
      if (topic in state.mqttSubscriptions) {
        state.mqttSubscriptions[topic] -= 1;
        if (state.mqttSubscriptions[topic] <= 0) {
          delete state.mqttSubscriptions[topic];
        }
      }
    },
  },
  actions: {},
  modules: {},
  getters: {
    usageTermsAcknowledged(state) {
      return new Promise((resolve) => {
        if (state.mqtt["openWB/system/usage_terms_acknowledged"] !== undefined) {
          resolve(state.mqtt["openWB/system/usage_terms_acknowledged"]);
        } else {
          var timer, interval;
          // add general timeout if topic not set
          timer = setTimeout(() => {
            clearInterval(interval);
            resolve(false);
          }, 5000);
          // check until we received valid data
          interval = setInterval(() => {
            if (state.mqtt["openWB/system/usage_terms_acknowledged"] !== undefined) {
              clearTimeout(timer);
              clearInterval(interval);
              resolve(state.mqtt["openWB/system/usage_terms_acknowledged"]);
            }
          }, 100);
        }
      });
    },
    installAssistantDone(state) {
      return new Promise((resolve) => {
        if (state.mqtt["openWB/system/installAssistantDone"] !== undefined) {
          resolve(state.mqtt["openWB/system/installAssistantDone"]);
        } else {
          var timer, interval;
          // add general timeout if topic not set
          timer = setTimeout(() => {
            clearInterval(interval);
            resolve(false);
          }, 5000);
          // check until we received valid data
          interval = setInterval(() => {
            if (state.mqtt["openWB/system/installAssistantDone"] !== undefined) {
              clearTimeout(timer);
              clearInterval(interval);
              resolve(state.mqtt["openWB/system/installAssistantDone"]);
            }
          }, 100);
        }
      });
    },
    subscriptionCount: (state) => (topic) => {
      return state.mqttSubscriptions[topic] || 0;
    },
  },
});
