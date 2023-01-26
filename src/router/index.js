import { createRouter, createWebHashHistory } from "vue-router";
import GeneralConfig from "../views/GeneralConfig.vue";

const routes = [
	{
		path: "/",
		redirect: "/GeneralConfig",
	},
	{
		path: "/Status",
		name: "Status",
		meta: {
			heading: "Status",
		},
		component: () =>
			import(
				/* webpackChunkName: "Status" */
				"../views/Status.vue"
			),
	},
	{
		path: "/Logging/ChargeLog",
		name: "ChargeLog",
		meta: {
			heading: "Auswertungen - Ladeprotokoll",
		},
		component: () =>
			import(
				/* webpackChunkName: "ChargeLog" */
				"../views/ChargeLog.vue"
			),
	},
	{
		path: "/Logging/DailyChart",
		name: "DailyChart",
		meta: {
			heading: "Auswertungen - Tagesauswertung",
		},
		component: () =>
			import(
				/* webpackChunkName: "DailyChart" */
				"../views/DailyChart.vue"
			),
	},
	{
		path: "/Logging/MonthlyChart",
		name: "MonthlyChart",
		meta: {
			heading: "Auswertungen - Monatsauswertung",
		},
		component: () =>
			import(
				/* webpackChunkName: "MonthlyChart" */
				"../views/MonthlyChart.vue"
			),
	},
	{
		path: "/GeneralConfig",
		name: "GeneralConfig",
		meta: {
			heading: "Einstellungen - Allgemein",
		},
		component: GeneralConfig,
	},
	{
		path: "/OptionalComponents",
		name: "OptionalComponents",
		meta: {
			heading: "Einstellungen - Optionale Hardware",
		},
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(
				/* webpackChunkName: "OptionalComponents" */
				"../views/OptionalComponents.vue"
			),
	},
	{
		path: "/GeneralChargeConfig",
		name: "GeneralChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Übergreifendes",
		},
		component: () =>
			import(
				/* webpackChunkName: "GeneralChargeConfig" */
				"../views/GeneralChargeConfig.vue"
			),
	},
	{
		path: "/InstantChargeConfig",
		name: "InstantChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Sofortladen",
		},
		component: () =>
			import(
				/* webpackChunkName: "InstantChargeConfig" */
				"../views/InstantChargeConfig.vue"
			),
	},
	{
		path: "/PVChargeConfig",
		name: "PVChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - PV-Laden",
		},
		component: () =>
			import(
				/* webpackChunkName: "PVChargeConfig" */
				"../views/PVChargeConfig.vue"
			),
	},
	{
		path: "/TimeChargeConfig",
		name: "TimeChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Zeitladen",
		},
		component: () =>
			import(
				/* webpackChunkName: "TimeChargeConfig" */
				"../views/TimeChargeConfig.vue"
			),
	},
	{
		path: "/ScheduledChargeConfig",
		name: "ScheduledChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Zielladen",
		},
		component: () =>
			import(
				/* webpackChunkName: "ScheduledChargeConfig" */
				"../views/ScheduledChargeConfig.vue"
			),
	},
	{
		path: "/StandbyChargeConfig",
		name: "StandbyChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Standby",
		},
		component: () =>
			import(
				/* webpackChunkName: "StandbyChargeConfig" */
				"../views/StandbyChargeConfig.vue"
			),
	},
	{
		path: "/HardwareInstallation",
		name: "HardwareInstallation",
		meta: {
			heading: "Konfiguration - Geräte und Komponenten",
		},
		component: () =>
			import(
				/* webpackChunkName: "HardwareInstallation" */
				"../views/HardwareInstallation.vue"
			),
	},
	{
		path: "/LoadManagementConfiguration",
		name: "LoadManagementConfiguration",
		meta: {
			heading: "Konfiguration - Lastmanagement",
		},
		component: () =>
			import(
				/* webpackChunkName: "LoadManagementConfiguration" */
				"../views/LoadManagementConfig.vue"
			),
	},
	{
		path: "/ChargePointInstallation",
		name: "ChargePointInstallation",
		meta: {
			heading: "Konfiguration - Ladepunkte",
		},
		component: () =>
			import(
				/* webpackChunkName: "ChargePointInstallation" */
				"../views/ChargePointInstallation.vue"
			),
	},
	{
		path: "/VehicleConfiguration/:section?/:section_index?",
		name: "VehicleConfiguration",
		meta: {
			heading: "Konfiguration - Fahrzeuge",
		},
		component: () =>
			import(
				/* webpackChunkName: "VehicleConfiguration" */
				"../views/VehicleConfig.vue"
			),
	},
	{
		path: "/System/CloudConfiguration",
		name: "CloudConfig",
		meta: {
			heading: "System - openWB Cloud",
		},
		component: () =>
			import(
				/* webpackChunkName: "CloudConfig" */
				"../views/CloudConfig.vue"
			),
	},
	{
		path: "/System/MqttBridgeConfiguration",
		name: "MqttBridgeConfig",
		meta: {
			heading: "System - MQTT-Brücken",
		},
		component: () =>
			import(
				/* webpackChunkName: "MqttBridgeConfig" */
				"../views/MqttBridgeConfig.vue"
			),
	},
	{
		path: "/System/DebugConfiguration",
		name: "Debugging",
		meta: {
			heading: "System - Fehlersuche",
		},
		component: () =>
			import(
				/* webpackChunkName: "DebugConfig" */
				"../views/DebugConfig.vue"
			),
	},
	{
		path: "/System/Support",
		name: "Support",
		meta: {
			heading: "System - Support",
		},
		component: () =>
			import(
				/* webpackChunkName: "Support" */
				"../views/Support.vue"
			),
	},
	{
		path: "/System/DataProtection",
		name: "DataProtection",
		meta: {
			heading: "System - Datenschutz",
		},
		component: () =>
			import(
				/* webpackChunkName: "DataProtection" */
				"../views/DataProtection.vue"
			),
	},
	{
		path: "/System/SystemConfiguration",
		name: "SystemConfig",
		meta: {
			heading: "System - System",
		},
		component: () =>
			import(
				/* webpackChunkName: "SystemConfig" */
				"../views/System.vue"
			),
	},
];
/* examples for development only start here */
if (process.env.NODE_ENV !== "production") {
	routes.push({
		path: "/TestingStore",
		name: "VUEX Store",
		meta: {
			heading: "Beispiele - VUEX Store",
		},
		component: () =>
			import(
				/* webpackChunkName: "testingStore" */
				"../views/TestingStore.vue"
			),
	});
}

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.afterEach((to) => {
	// change page (or tab) title
	if (to.meta.heading) {
		document.title = "openWB | " + to.meta.heading;
	} else {
		document.title = "openWB";
	}
});

export default router;
