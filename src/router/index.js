import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    redirect: "/GeneralConfiguration",
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
    name: "Chart",
    meta: {
      heading: "Auswertungen - Diagramme",
    },
    component: () => import("../views/Chart.vue"),
  },
  {
    path: "/GeneralConfiguration",
    name: "GeneralConfiguration",
    meta: {
      heading: "Einstellungen - Allgemein",
    },
    component: () => import("../views/GeneralConfiguration.vue"),
  },
  {
    path: "/IdentificationConfiguration",
    name: "IdentificationConfiguration",
    meta: {
      heading: "Einstellungen - Identifikation",
    },
    component: () => import("../views/IdentificationConfiguration.vue"),
  },
  {
    path: "/DisplayConfiguration",
    name: "DisplayConfiguration",
    meta: {
      heading: "Einstellungen - Display",
    },
    component: () => import("../views/DisplayConfiguration.vue"),
  },
  {
    path: "/GeneralChargeConfiguration",
    name: "GeneralChargeConfiguration",
    meta: {
      heading: "Ladeeinstellungen - Übergreifendes",
    },
    component: () => import("../views/GeneralChargeConfiguration.vue"),
  },
  {
    path: "/SurplusChargeConfiguration",
    name: "SurplusChargeConfiguration",
    meta: {
      heading: "Ladeeinstellungen - Überschuss-Laden",
    },
    component: () => import("../views/SurplusChargeConfiguration.vue"),
  },
  {
    path: "/ActiveBatControlConfiguration",
    name: "ActiveBatControlConfiguration",
    meta: {
      heading: "Ladeeinstellungen - Speichersteuerung",
    },
    component: () => import("../views/ActiveBatControlConfiguration.vue"),
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
    component: () => import("../views/LoadManagementConfiguration.vue"),
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
    component: () => import("../views/VehicleConfiguration.vue"),
  },
  {
    path: "/IoConfiguration",
    name: "IoConfiguration",
    meta: {
      heading: "Konfiguration - Ein- und Ausgänge",
    },
    component: () => import("../views/IoConfiguration.vue"),
  },
  {
    path: "/System/CloudConfiguration",
    name: "CloudConfiguration",
    meta: {
      heading: "System - openWB Cloud",
    },
    component: () => import("../views/CloudConfiguration.vue"),
  },
  {
    path: "/System/MqttBridgeConfiguration",
    name: "MqttBridgeConfiguration",
    meta: {
      heading: "System - MQTT-Brücken",
    },
    component: () => import("../views/MqttBridgeConfiguration.vue"),
  },
  {
    path: "/System/DebugConfiguration",
    name: "DebugConfiguration",
    meta: {
      heading: "System - Fehlersuche",
    },
    component: () => import("../views/DebugConfiguration.vue"),
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
    name: "SystemConfiguration",
    meta: {
      heading: "System - System",
    },
    component: () => import("../views/SystemConfiguration.vue"),
  },
  {
    path: "/System/SecurityConfiguration",
    name: "SecurityConfiguration",
    meta: {
      heading: "System - Sicherheit",
    },
    component: () => import("../views/SecurityConfiguration.vue"),
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
  console.log("checking access for", to.name);
  const hasPermission = await store.getters.accessAllowed(to.name);
  console.log("access check for", to.name, "->", hasPermission);
  if (!hasPermission) {
    console.warn("no permission to access", to.name);
    if (store.state.local.username) {
      // logged in but no permission
      return { name: "Error" };
    }
    console.debug("not logged in, cancel navigation to", to.name);
    return false; // cancel navigation
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
