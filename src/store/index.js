import { createStore } from "vuex";

export default createStore({
	// strict: process.env.NODE_ENV !== "production",
	state: {
		mqtt: {},
		examples: {
			text1: "Text...",
			text2: "mail@domain.com",
			text3: "openwb.local",
			text4: "http://www.openwb.de",
			text5: "Benutzername",
			text6: "12:34",
			text7: "2021-10-31",
			number1: 0,
			number2: 0,
			password1: "GeHeiM!",
			textarea1: "Langer Text...",
			range1: 6,
			range2: 10,
			select1: 1,
			select2: "three",
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
			availableDevices: [
				{
					value: "solaredge",
					text: "Solaredge Verbund",
				},
				{
					value: "fronius",
					text: "Fronius Verbund",
				},
			],
			installedDevices: [
				{
					id: 0,
					type: "solaredge",
					name: "Solaredge Verbund",
					components: [
						{
							id: "0.1",
							type: "se_wr_1",
							name: "Wechselrichter 1",
						},
					],
				},
				{
					id: 1,
					type: "fronius",
					name: "Fronius Verbund",
					components: [
						{
							id: "1.1",
							type: "fr_wr_1",
							name: "Wechselrichter 1",
						},
						{
							id: "1.2",
							type: "fr_sm",
							name: "SmartMeter",
						},
					],
				},
			],
		},
	},
	mutations: {
		addTopic(state, message) {
			state.mqtt[message.topic] = message.payload;
		},
		removeTopic(state, topic) {
			delete state.mqtt[topic];
		},
		updateTopic(state, message) {
			// helper function to update nested objects py path
			const setPath = (object, path, value) =>
				path
					.split(".")
					.reduce(
						(o, p, i) =>
							(o[p] =
								path.split(".").length === ++i
									? value
									: o[p] || {}),
						object
					);

			if (message.topic in state.mqtt) {
				if (message.objectPath != undefined) {
					setPath(
						state.mqtt[message.topic],
						message.objectPath,
						message.payload
					);
				} else {
					state.mqtt[message.topic] = message.payload;
				}
			} else {
				console.debug("topic not found in state.mqtt: ", message.topic);
				if (message.topic in state.examples) {
					if (message.objectPath != undefined) {
						setPath(
							state.examples[message.topic],
							message.objectPath,
							message.payload
						);
					} else {
						state.examples[message.topic] = message.payload;
					}
				} else {
					console.warn(
						"topic not found in state: ",
						message.topic,
						" giving up"
					);
				}
			}
		},
	},
	actions: {},
	modules: {},
});
