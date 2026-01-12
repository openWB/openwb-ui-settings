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
      requiredPermission: "accessStatusAllowed",
    },
    component: () => import("../views/Status.vue"),
  },
  {
    path: "/Logging/ChargeLog",
    name: "ChargeLog",
    meta: {
      heading: "Auswertungen - Ladeprotokoll",
      requiredPermission: "accessChargeLogAllowed",
    },
    component: () => import("../views/ChargeLog.vue"),
  },
  {
    path: "/Logging/Chart/:chartRange?/:initialDate?",
    name: "Chart",
    meta: {
      heading: "Auswertungen - Diagramme",
      requiredPermission: "accessChartAllowed",
    },
    component: () => import("../views/Chart.vue"),
  },
  {
    path: "/GeneralConfig",
    name: "GeneralConfig",
    meta: {
      heading: "Einstellungen - Allgemein",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/GeneralConfig.vue"),
  },
  {
    path: "/IdentificationConfig",
    name: "IdentificationConfig",
    meta: {
      heading: "Einstellungen - Identifikation",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/IdentificationConfig.vue"),
  },
  {
    path: "/OptionalComponents",
    name: "OptionalComponents",
    meta: {
      heading: "Einstellungen - Display",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/OptionalComponents.vue"),
  },
  {
    path: "/GeneralChargeConfig",
    name: "GeneralChargeConfig",
    meta: {
      heading: "Ladeeinstellungen - Übergreifendes",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/GeneralChargeConfig.vue"),
  },
  {
    path: "/SurplusChargeConfig",
    name: "SurplusChargeConfig",
    meta: {
      heading: "Ladeeinstellungen - Überschuss-Laden",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/SurplusChargeConfig.vue"),
  },
  {
    path: "/ActiveBatControl",
    name: "ActiveBatControl",
    meta: {
      heading: "Ladeeinstellungen - Speichersteuerung",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/ActiveBatControl.vue"),
  },
  {
    path: "/HardwareInstallation",
    name: "HardwareInstallation",
    meta: {
      heading: "Konfiguration - Geräte und Komponenten",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/HardwareInstallation.vue"),
  },
  {
    path: "/LoadManagementConfiguration",
    name: "LoadManagementConfiguration",
    meta: {
      heading: "Konfiguration - Lastmanagement",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/LoadManagementConfig.vue"),
  },
  {
    path: "/ChargePointInstallation",
    name: "ChargePointInstallation",
    meta: {
      heading: "Konfiguration - Ladepunkte",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/ChargePointInstallation.vue"),
  },
  {
    path: "/VehicleConfiguration/:section?/:section_index?/:section_part?/:action?",
    name: "VehicleConfiguration",
    meta: {
      heading: "Konfiguration - Fahrzeuge",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/VehicleConfig.vue"),
  },
  {
    path: "/IoConfiguration",
    name: "IoConfiguration",
    meta: {
      heading: "Konfiguration - Ein- und Ausgänge",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/IoConfig.vue"),
  },
  {
    path: "/System/CloudConfiguration",
    name: "CloudConfig",
    meta: {
      heading: "System - openWB Cloud",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/CloudConfig.vue"),
  },
  {
    path: "/System/MqttBridgeConfiguration",
    name: "MqttBridgeConfig",
    meta: {
      heading: "System - MQTT-Brücken",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/MqttBridgeConfig.vue"),
  },
  {
    path: "/System/DebugConfiguration",
    name: "Debugging",
    meta: {
      heading: "System - Fehlersuche",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/DebugConfig.vue"),
  },
  {
    path: "/System/Support",
    name: "Support",
    meta: {
      heading: "System - Support",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/Support.vue"),
  },
  {
    path: "/System/LegalSettings",
    name: "LegalSettings",
    meta: {
      heading: "System - Rechtliches",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/LegalSettings.vue"),
  },
  {
    path: "/System/SystemConfiguration",
    name: "SystemConfig",
    meta: {
      heading: "System - System",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/System.vue"),
  },
  {
    path: "/System/SecurityConfiguration",
    name: "SecurityConfig",
    meta: {
      heading: "System - Sicherheit",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/Security.vue"),
  },
  {
    path: "/System/DataManagement",
    name: "DataManagement",
    meta: {
      heading: "System - Datenverwaltung",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/DataManagement.vue"),
  },
  {
    path: "/System/InstallAssistant",
    name: "InstallAssistant",
    meta: {
      heading: "System - Einrichtungsassistent",
      requiredPermission: "accessSettingsAllowed",
    },
    component: () => import("../views/InstallAssistant.vue"),
  },
  {
    path: "/Error",
    name: "Error",
    meta: {
      heading: "Fehler",
    },
    component: () => import("../views/Error.vue"),
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
  if (to.meta.requiredPermission) {
    const hasPermission = await store.getters[to.meta.requiredPermission];
    if (!hasPermission) {
      console.warn("no permission to access", to.name);
      if (store.state.local.username) {
        // logged in but no permission
        return { name: "Error" };
      }
      console.debug("not logged in, cancel navigation to", to.name);
      return false; // cancel navigation
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
