import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

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
    path: "/Logging/Chart/:chartRange?/:initialDate?",
    name: "DailyChart",
    meta: {
      heading: "Auswertungen - Diagramme",
    },
    component: () => import("../views/Chart.vue"),
  },
  {
    path: "/GeneralConfig",
    name: "GeneralConfig",
    meta: {
      heading: "Einstellungen - Allgemein",
    },
    component: () => import("../views/GeneralConfig.vue"),
  },
  {
    path: "/OptionalComponents",
    name: "OptionalComponents",
    meta: {
      heading: "Einstellungen - Optionale Hardware",
    },
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
    path: "/VehicleConfiguration/:section?/:section_index?/:section_part?/:action?",
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
    path: "/System/LegalSettings",
    name: "LegalSettings",
    meta: {
      heading: "System - Rechtliches",
    },
    component: () => import("../views/LegalSettings.vue"),
  },
  {
    path: "/System/SystemConfiguration",
    name: "SystemConfig",
    meta: {
      heading: "System - System",
    },
    component: () => import("../views/System.vue"),
  },
  {
    path: "/System/DataManagement",
    name: "DataManagement",
    meta: {
      heading: "System - Datenverwaltung",
    },
    component: () => import("../views/DataManagement.vue"),
  },
  {
    path: "/System/InstallAssistant",
    name: "InstallAssistant",
    meta: {
      heading: "System - Einrichtungsassistent",
    },
    component: () => import("../views/InstallAssistant.vue"),
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

router.beforeEach(async (to) => {
  // get usage terms status
  const usageTermsAcknowledged = await store.getters.usageTermsAcknowledged;
  if (!usageTermsAcknowledged) {
    if (to.name !== "LegalSettings") {
      // redirect to data protection page to force acceptance of usage terms
      return { name: "LegalSettings" };
    }
  } else {
    // get install assistant status
    const installAssistantDone = await store.getters.installAssistantDone;
    if (!installAssistantDone) {
      if (to.name !== "InstallAssistant") {
        // redirect to install assistant as a first setup guide
        return { name: "InstallAssistant" };
      }
    }
  }
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
