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
		component: () => import("../views/Status.vue"),
	},
	{
		path: "/Logging/ChargeLog",
		name: "ChargeLog",
		meta: {
			heading: "Auswertungen - Ladeprotokoll",
		},
		component: () => import("../views/ChargeLog.vue"),
	},
	{
		path: "/Logging/DailyChart",
		name: "DailyChart",
		meta: {
			heading: "Auswertungen - Tagesauswertung",
		},
		component: () => import("../views/DailyChart.vue"),
	},
	{
		path: "/Logging/MonthlyChart",
		name: "MonthlyChart",
		meta: {
			heading: "Auswertungen - Monatsauswertung",
		},
		component: () => import("../views/MonthlyChart.vue"),
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
		component: () => import("../views/OptionalComponents.vue"),
	},
	{
		path: "/GeneralChargeConfig",
		name: "GeneralChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Übergreifendes",
		},
		component: () => import("../views/GeneralChargeConfig.vue"),
	},
	{
		path: "/InstantChargeConfig",
		name: "InstantChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Sofortladen",
		},
		component: () => import("../views/InstantChargeConfig.vue"),
	},
	{
		path: "/PVChargeConfig",
		name: "PVChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - PV-Laden",
		},
		component: () => import("../views/PVChargeConfig.vue"),
	},
	{
		path: "/TimeChargeConfig",
		name: "TimeChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Zeitladen",
		},
		component: () => import("../views/TimeChargeConfig.vue"),
	},
	{
		path: "/ScheduledChargeConfig",
		name: "ScheduledChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Zielladen",
		},
		component: () => import("../views/ScheduledChargeConfig.vue"),
	},
	{
		path: "/StandbyChargeConfig",
		name: "StandbyChargeConfig",
		meta: {
			heading: "Ladeeinstellungen - Standby",
		},
		component: () => import("../views/StandbyChargeConfig.vue"),
	},
	{
		path: "/HardwareInstallation",
		name: "HardwareInstallation",
		meta: {
			heading: "Konfiguration - Geräte und Komponenten",
		},
		component: () => import("../views/HardwareInstallation.vue"),
	},
	{
		path: "/LoadManagementConfiguration",
		name: "LoadManagementConfiguration",
		meta: {
			heading: "Konfiguration - Lastmanagement",
		},
		component: () => import("../views/LoadManagementConfig.vue"),
	},
	{
		path: "/ChargePointInstallation",
		name: "ChargePointInstallation",
		meta: {
			heading: "Konfiguration - Ladepunkte",
		},
		component: () => import("../views/ChargePointInstallation.vue"),
	},
	{
		path: "/VehicleConfiguration/:section?/:section_index?",
		name: "VehicleConfiguration",
		meta: {
			heading: "Konfiguration - Fahrzeuge",
		},
		component: () => import("../views/VehicleConfig.vue"),
	},
	{
		path: "/System/CloudConfiguration",
		name: "CloudConfig",
		meta: {
			heading: "System - openWB Cloud",
		},
		component: () => import("../views/CloudConfig.vue"),
	},
	{
		path: "/System/MqttBridgeConfiguration",
		name: "MqttBridgeConfig",
		meta: {
			heading: "System - MQTT-Brücken",
		},
		component: () => import("../views/MqttBridgeConfig.vue"),
	},
	{
		path: "/System/DebugConfiguration",
		name: "Debugging",
		meta: {
			heading: "System - Fehlersuche",
		},
		component: () => import("../views/DebugConfig.vue"),
	},
	{
		path: "/System/Support",
		name: "Support",
		meta: {
			heading: "System - Support",
		},
		component: () => import("../views/Support.vue"),
	},
	{
		path: "/System/DataProtection",
		name: "DataProtection",
		meta: {
			heading: "System - Datenschutz",
		},
		component: () => import("../views/DataProtection.vue"),
	},
	{
		path: "/System/SystemConfiguration",
		name: "SystemConfig",
		meta: {
			heading: "System - System",
		},
		component: () => import("../views/System.vue"),
	},
];
/* examples for development only start here */
if (import.meta.env.MODE !== "production") {
	routes.push({
		path: "/TestingStore",
		name: "VUEX Store",
		meta: {
			heading: "Beispiele - VUEX Store",
		},
		component: () => import("../views/TestingStore.vue"),
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
