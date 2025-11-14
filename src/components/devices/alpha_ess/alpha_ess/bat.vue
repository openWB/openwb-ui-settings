<template>
  <div class="device-alphaess-bat">
    <openwb-base-alert subtype="info">
      Der AlphaESS Speicher kann die Speicherentladung bei aktiver Speichersteuerung nur komplett sperren.<br />
      Zur Nutzung müssen über Webinterface oder App einmalig Zeiten für das Netzladen definiert werden. (Einstellungen
      -> Funktionseinstellungen -> Netzladen/Entladen). Hier einen durchgängigen Zeitraum eintragen (Ladezeit 1:
      00:00-23:00, Ladezeit 2 23:00-00:00). Den Schalter "Netzladen" deaktivieren!
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceAlphaEssBat",
  mixins: [ComponentConfigMixin],
};
</script>
