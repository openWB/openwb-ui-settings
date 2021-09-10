import { createStore } from "vuex";

export default createStore({
  // strict: process.env.NODE_ENV !== "production",
  state: {
    mqtt: {},
    text1: "Text...",
    text2: "mail@domain.com",
    text3: "openwb.local",
    text4: "http://www.openwb.de",
    text5: "Benutzername",
    number1: 0,
    number2: 0,
    password1: "GeHeiM!",
    textarea1: "Langer Text...",
    range1: 6,
    range2: 10,
    select1: 1,
    select2: 3,
    buttongroup1: 1,
    checkbox1: true,
    json1: { text: "Text", number: 123 },
    hierarchy1: [
      {
        id: "counter0",
        value: "EVU",
        children: [
          {
            id: "cp1",
            value: "Ladepunkt 1",
            children: [],
          },
          {
            id: "cp2",
            value: "Ladepunkt 2",
            children: [],
          },
          {
            id: "cp3",
            value: "Ladepunkt 3",
            children: [],
          },
        ],
      },
    ],
  },
  mutations: {
    addTopic(state, message) {
      state.mqtt[message.topic] = message.payload;
    },
    removeTopic(state, topic) {
      delete state.mqtt[topic];
    },
    updateTopic(state, message) {
      if (message.topic in state.mqtt) {
        state.mqtt[message.topic] = message.payload;
      } else {
        console.warn("topic not found in state.mqtt: ", message.topic);
      }
    },
  },
  actions: {},
  modules: {},
});
