import { createStore } from "vuex";

let states = {
	mqtt: {},
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
		select2: "three",
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
			state.mqtt[message.topic] = message.payload;
		},
		removeTopic(state, topic) {
			//prevent bug in installAssistent when browsing back: undefined state because of 
			//removed topic in Steuerungsmodus (primary <-> secondary)
			//and HardwareInstallation (missing devices and components)
			//topic will be removed after mounting of page therefore prevent removing
			if(topic!= 'openWB/general/extern'){
				//if(topic!= 'openWB/counter/get/hierarchy'){
						//var re = new RegExp("^([/device])$")
						//if(re.test(topic)){
							delete state.mqtt[topic];
						//	console.info("REMOVED: ", topic)
						//}
					//}
				}
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
						object,
					);

			if (message.topic in state.mqtt) {
				if (message.objectPath != undefined) {
					setPath(
						state.mqtt[message.topic],
						message.objectPath,
						message.payload,
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
							message.payload,
						);
					} else {
						state.examples[message.topic] = message.payload;
					}
				} else {
					console.warn(
						"topic not found in state: ",
						message.topic,
						" giving up",
					);
				}
			}
		},
	},
	actions: {},
	modules: {},
	getters: {
		usageTermsAcknowledged(state) {
			return new Promise((resolve) => {
				if (
					state.mqtt["openWB/system/usage_terms_acknowledged"] !==
					undefined
				) {
					resolve(
						state.mqtt["openWB/system/usage_terms_acknowledged"],
					);
				} else {
					var timer, interval;
					// add general timeout if topic not set
					timer = setTimeout(() => {
						clearInterval(interval);
						resolve(false);
					}, 5000);
					// check until we received valid data
					interval = setInterval(() => {
						if (
							state.mqtt[
								"openWB/system/usage_terms_acknowledged"
							] !== undefined
						) {
							clearTimeout(timer);
							clearInterval(interval);
							resolve(
								state.mqtt[
									"openWB/system/usage_terms_acknowledged"
								],
							);
						}
					}, 100);
				}
			});
		},
		installAssistant(state) {
			return new Promise((resolve) => {
				if (state.mqtt["openWB/system/installAssistantDone"] !== undefined) {
					resolve(state.mqtt["openWB/system/installAssistantDone"],
					);
				} else {
					var timer, interval;
					// add general timeout if topic not set
					timer = setTimeout(() => {
						clearInterval(interval);
						resolve(false);
					}, 5000);
					// check until we received valid data
					interval = setInterval(() => {
						if (
							state.mqtt["openWB/system/installAssistantDone"] !==
							undefined
						) {
							clearTimeout(timer);
							clearInterval(interval);
							resolve(state.mqtt["openWB/system/installAssistantDone"]);
						}
					}, 100);
				}
			});
		},
	},
});
