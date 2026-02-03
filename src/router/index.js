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
      checkPermissions: true,
    },
    component: () => import("../views/Status.vue"),
  },
  {
    path: "/Logging/ChargeLog",
    name: "ChargeLog",
    meta: {
      heading: "Auswertungen - Ladeprotokoll",
      checkPermissions: true,
    },
    component: () => import("../views/ChargeLog.vue"),
  },
  {
    path: "/Logging/Chart/:chartRange?/:initialDate?",
    name: "Chart",
    meta: {
      heading: "Auswertungen - Diagramme",
      checkPermissions: true,
    },
    component: () => import("../views/Chart.vue"),
  },
  {
    path: "/GeneralConfiguration",
    name: "GeneralConfiguration",
    meta: {
      heading: "Einstellungen - Allgemein",
      checkPermissions: true,
    },
    component: () => import("../views/GeneralConfiguration.vue"),
  },
  {
    path: "/IdentificationConfiguration",
    name: "IdentificationConfiguration",
    meta: {
      heading: "Einstellungen - Identifikation",
      checkPermissions: true,
    },
    component: () => import("../views/IdentificationConfiguration.vue"),
  },
  {
    path: "/DisplayConfiguration",
    name: "DisplayConfiguration",
    meta: {
      heading: "Einstellungen - Display",
      checkPermissions: true,
    },
    component: () => import("../views/DisplayConfiguration.vue"),
  },
  {
    path: "/GeneralChargeConfiguration",
    name: "GeneralChargeConfiguration",
    meta: {
      heading: "Ladeeinstellungen - Übergreifendes",
      checkPermissions: true,
    },
    component: () => import("../views/GeneralChargeConfiguration.vue"),
  },
  {
    path: "/SurplusChargeConfiguration",
    name: "SurplusChargeConfiguration",
    meta: {
      heading: "Ladeeinstellungen - Überschuss-Laden",
      checkPermissions: true,
    },
    component: () => import("../views/SurplusChargeConfiguration.vue"),
  },
  {
    path: "/ActiveBatControlConfiguration",
    name: "ActiveBatControlConfiguration",
    meta: {
      heading: "Ladeeinstellungen - Speichersteuerung",
      checkPermissions: true,
    },
    component: () => import("../views/ActiveBatControlConfiguration.vue"),
  },
  {
    path: "/HardwareInstallation",
    name: "HardwareInstallation",
    meta: {
      heading: "Konfiguration - Geräte und Komponenten",
      checkPermissions: true,
    },
    component: () => import("../views/HardwareInstallation.vue"),
  },
  {
    path: "/LoadManagementConfiguration",
    name: "LoadManagementConfiguration",
    meta: {
      heading: "Konfiguration - Lastmanagement",
      checkPermissions: true,
    },
    component: () => import("../views/LoadManagementConfiguration.vue"),
  },
  {
    path: "/ChargePointInstallation",
    name: "ChargePointInstallation",
    meta: {
      heading: "Konfiguration - Ladepunkte",
      checkPermissions: true,
    },
    component: () => import("../views/ChargePointInstallation.vue"),
  },
  {
    path: "/VehicleConfiguration/:section?/:section_index?/:section_part?/:action?",
    name: "VehicleConfiguration",
    meta: {
      heading: "Konfiguration - Fahrzeuge",
      checkPermissions: true,
    },
    component: () => import("../views/VehicleConfiguration.vue"),
  },
  {
    path: "/IoConfiguration",
    name: "IoConfiguration",
    meta: {
      heading: "Konfiguration - Ein- und Ausgänge",
      checkPermissions: true,
    },
    component: () => import("../views/IoConfiguration.vue"),
  },
  {
    path: "/System/CloudConfiguration",
    name: "CloudConfiguration",
    meta: {
      heading: "System - openWB Cloud",
      checkPermissions: true,
    },
    component: () => import("../views/CloudConfiguration.vue"),
  },
  {
    path: "/System/MqttBridgeConfiguration",
    name: "MqttBridgeConfiguration",
    meta: {
      heading: "System - MQTT-Brücken",
      checkPermissions: true,
    },
    component: () => import("../views/MqttBridgeConfiguration.vue"),
  },
  {
    path: "/System/DebugConfiguration",
    name: "DebugConfiguration",
    meta: {
      heading: "System - Fehlersuche",
      checkPermissions: true,
    },
    component: () => import("../views/DebugConfiguration.vue"),
  },
  {
    path: "/System/Support",
    name: "Support",
    meta: {
      heading: "System - Support",
      checkPermissions: true,
    },
    component: () => import("../views/Support.vue"),
  },
  {
    path: "/System/LegalSettings",
    name: "LegalSettings",
    meta: {
      heading: "System - Rechtliches",
      checkPermissions: true,
    },
    component: () => import("../views/LegalSettings.vue"),
  },
  {
    path: "/System/SystemConfiguration",
    name: "SystemConfiguration",
    meta: {
      heading: "System - System",
      checkPermissions: true,
    },
    component: () => import("../views/SystemConfiguration.vue"),
  },
  {
    path: "/System/SecurityConfiguration",
    name: "SecurityConfiguration",
    meta: {
      heading: "System - Sicherheit",
      checkPermissions: true,
    },
    component: () => import("../views/SecurityConfiguration.vue"),
  },
  {
    path: "/System/DataManagement",
    name: "DataManagement",
    meta: {
      heading: "System - Datenverwaltung",
      checkPermissions: true,
    },
    component: () => import("../views/DataManagement.vue"),
  },
  {
    path: "/System/InstallAssistant",
    name: "InstallAssistant",
    meta: {
      heading: "System - Einrichtungsassistent",
      checkPermissions: true,
    },
    component: () => import("../views/InstallAssistant.vue"),
  },
  {
    path: "/Error",
    name: "Error",
    meta: {
      heading: "Fehler",
      checkPermissions: false,
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
      checkPermissions: false,
    },
    component: () => import("../views/TestingStore.vue"),
  });
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

let routeDone = false;

router.beforeEach(async (to) => {
  routeDone = false;
  // get usage terms status
  const usageTermsAcknowledged = await store.getters.usageTermsAcknowledged;
  if (!usageTermsAcknowledged) {
    if (to.name !== "LegalSettings") {
      // redirect to data protection page to force acceptance of usage terms
      return { name: "LegalSettings" };
    }
  }
  // get install assistant status
  const installAssistantDone = await store.getters.installAssistantDone;
  if (!installAssistantDone) {
    if (to.name !== "InstallAssistant") {
      // redirect to install assistant as a first setup guide
      return { name: "InstallAssistant" };
    }
  }
  if (to.meta.checkPermissions === true) {
    const hasPermission = await store.getters.accessAllowed(to.name);
    console.debug("access check for", to.name, "->", hasPermission);
    if (routeDone) {
      console.debug("route already handled, cancel further processing");
      return false;
    }
    if (!hasPermission) {
      console.warn("no permission to access", to.name);
      if (store.state.local.username) {
        // logged in but no permission
        return { name: "Error" };
      }
      console.debug("not logged in, cancel navigation to", to.name);
      routeDone = true;
      return false; // cancel navigation
    }
  }
  routeDone = true;
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
