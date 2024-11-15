<template>
  <div class="charge-point-mqtt">
    <openwb-base-alert subtype="danger">
      Dieser Ladepunkt-Typ darf nur in Kombination mit dem Simulator zur Fehleranalyse genutzt werden. Eine andere
      Verwendung ist laut den Nutzungsbedingungen untersagt.
    </openwb-base-alert>
    <openwb-base-alert subtype="info">
      Das MQTT Modul stellt keine aktive Verbindung her, sondern erwartet, dass die Daten von speziellen Topics im
      Broker gelesen bzw. geschrieben werden.<br />
      Alle Daten werden als gültiges JSON gesendet und auch so erwartet! Zahlen mit Nachkommastellen (Float) verwenden
      einen Punkt als Dezimaltrenner (internationales Format).
      <ol>
        <li>
          von openWB gesendete Topics
          <ul>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/chargepoint/{{ chargePoint.id }}/set/current </openwb-base-copy-to-clipboard
              ><br />
              Sollwert des Ladestroms, mit Nachkommastellen (Float), positiv (laden) oder negativ (entladen, falls vom
              Ladepunkt unterstützt).<br />
              Beispiel: <span class="text-info">12.34</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/chargepoint/{{ chargePoint.id }}/set/phases_to_use </openwb-base-copy-to-clipboard
              ><br />
              Sollwert für die Anzahl Phasen als Ganzzahl (Integer). Mögliche Werte: 1 oder 3<br />
              Beispiel: <span class="text-info">1</span>
            </li>
          </ul>
        </li>
        <li>
          von openWB zwingend erwartete Topics
          <ul>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/currents </openwb-base-copy-to-clipboard
              ><br />
              Aktuelle Phasenströme des Ladepunktes, Array mit drei Zahlen (Float), positiv (laden) oder negativ
              (entladen, falls vom Ladepunkt unterstützt).<br />
              Beispiel:
              <span class="text-info">[6.78,6.89,6.94]</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/power </openwb-base-copy-to-clipboard
              ><br />
              Leistung in Watt, mit Nachkommastellen (Float), positiv (laden) oder negativ (entladen, falls vom
              Ladepunkt unterstützt).<br />
              Beispiel: <span class="text-info">123.45</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/plug_state </openwb-base-copy-to-clipboard
              ><br />
              Zeigt an, ob aktuell ein Fahrzeug angesteckt ist, Wahrheitswert (Bool).<br />
              Beispiel: <span class="text-info">true</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/charge_state </openwb-base-copy-to-clipboard
              ><br />
              Zeigt an, ob ein Ladevorgang aktiv ist, Wahrheitswert (Bool).<br />
              Beispiel: <span class="text-info">true</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/phases_in_use </openwb-base-copy-to-clipboard
              ><br />
              Anzahl der Phasen, mit denen geladen wird, Ganzzahl (Integer). Mögliche Werte: 0 bis 3<br />
              Beispiel: <span class="text-info">3</span>
            </li>
          </ul>
        </li>
        <li>
          optionale Topics
          <ul>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/imported </openwb-base-copy-to-clipboard
              ><br />
              Geladene Energie in Wh, mit Nachkommastellen (Float), nur positiv<br />
              Wird dieses Topic nicht vom Ladepunkt gesendet, so wird intern ein Zählerstand anhand der Leistung
              simuliert.<br />
              Beispiel:
              <span class="text-info">123.45</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/exported </openwb-base-copy-to-clipboard
              ><br />
              Entladene Energie in Wh, mit Nachkommastellen (Float), nur positiv<br />
              Wird dieses Topic nicht vom Ladepunkt gesendet, so wird intern ein Zählerstand anhand der Leistung
              simuliert.<br />
              Beispiel: <span class="text-info">123.45</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/voltages </openwb-base-copy-to-clipboard
              ><br />
              Aktuelle Phasenspannungen des Ladepunktes, Array mit drei Zahlen (Float), nur positiv.<br />
              Die Spannungen werden nicht verarbeitet, sondern lediglich im Status angezeigt.<br />
              Beispiel:
              <span class="text-info">[230.12,231.08,232.54]</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/power_factors </openwb-base-copy-to-clipboard
              ><br />
              Aktuelle Leistungsfaktoren des Ladepunktes, Array mit drei Zahlen (Float), Wertebereich von -1 bis 1.<br />
              Die Leistungsfaktoren werden nicht verarbeitet, sondern lediglich im Status angezeigt.<br />
              Beispiel:
              <span class="text-info">[-0.87,0.96,1.0]</span>
            </li>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/chargepoint/{{ chargePoint.id }}/get/rfid_tag </openwb-base-copy-to-clipboard
              ><br />
              Eine Zeichenfolge, die einen eingelesenen Tag für openWB repräsentiert.<br />
              Beispiel:
              <span class="text-info">"123654"</span>
            </li>
          </ul>
        </li>
      </ol>
    </openwb-base-alert>
  </div>
</template>

<script>
import ChargePointConfigMixin from "../ChargePointConfigMixin.vue";

export default {
  name: "ChargePointMqtt",
  mixins: [ChargePointConfigMixin],
};
</script>
