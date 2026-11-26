<template>
  <div
    v-if="message || hasRecordingGaps || hasRecordedFaults"
    class="chart-data-quality"
  >
    <openwb-base-card
      :title="
        message || hasRecordedFaults ? 'Energieverteilung nur eingeschränkt berechenbar' : 'Lücken in der Aufzeichnung'
      "
      subtype="warning"
    >
      <p v-if="message">
        Für den gewählten Zeitraum liegen Berechnungsmeldungen vor. Die angezeigten Summen und Energieanteile sind
        deshalb nicht durchgehend als vollständige, verlässliche Messung zu verstehen.
      </p>
      <p v-else-if="hasRecordedFaults">
        Für den gewählten Tag sind Fehlerzustände in den Komponentenwerten aufgezeichnet. Die Energieaufteilung ist
        deshalb nur eingeschränkt beurteilbar. Eine bestimmte Ersatzberechnung ist durch diese Statuswerte allein nicht
        nachgewiesen.
      </p>
      <p v-else>
        Für den gewählten Tag wurden Lücken in der Aufzeichnung erkannt. Dadurch kann die zeitliche Zuordnung der
        Energie eingeschränkt sein. Eine Aufzeichnungslücke allein belegt keinen Gerätefehler.
      </p>
      <ul
        v-if="gridFallback || zeroFallback"
        class="fallback-notes"
      >
        <li v-if="gridFallback">
          <strong>Ersatzzuordnung zum Netz:</strong> Bei nicht berechenbarem Strommix wurden Verbräuche dem Netz
          zugerechnet. Das bedeutet nicht, dass tatsächlich ausschließlich Netzstrom verwendet wurde.
        </li>
        <li v-if="zeroFallback">
          <strong>Nicht berechenbare Energieanteile:</strong> Betroffene Quellenanteile wurden mit 0 kWh angesetzt. Das
          bedeutet nicht automatisch, dass kein Verbrauch stattgefunden hat.
        </li>
      </ul>
      <p v-if="message || hasRecordedFaults">
        openWB kann fehlende oder fehlerhafte Eingangswerte nicht durch eine vollständige Messung ersetzen. Die
        folgenden Details zeigen, wo die Datenbasis eingeschränkt war; die genaue Ursache muss am Gerät und an dessen
        Anbindung geprüft werden.
      </p>

      <details class="quality-details">
        <summary>Betroffene Zeiträume und Hilfe anzeigen</summary>
        <div class="pt-3">
          <template v-if="range === 'day' && quality.components.length">
            <p class="small text-muted">
              Angezeigt werden die ersten und letzten aufgezeichneten Fehlerzeitpunkte eines zusammenhängenden
              Abschnitts am ausgewählten Tag. Die tatsächliche Störung kann früher begonnen oder später geendet haben.
              Ein Fehlerzustand belegt nicht, ob Werte fehlten, ungültig waren oder die Geräteabfrage scheiterte.
            </p>
            <section
              v-for="component in quality.components"
              :key="component.id"
              class="component-issue"
            >
              <h3 class="h6 font-weight-bold">
                {{ groupLabel(component.group) }}
                <template v-if="component.key !== 'all'"> · {{ component.name }} ({{ component.key }})</template>
              </h3>
              <p v-if="component.key === 'all' && component.group !== 'hc'">
                Der Fehler ist nur als Summenstatus dieser Gruppe aufgezeichnet. Welches einzelne Gerät betroffen war,
                lässt sich daraus nicht sicher bestimmen.
              </p>
              <ul class="issue-periods">
                <li
                  v-for="(period, index) in component.ranges"
                  :key="index"
                >
                  <strong
                    >{{ period.from }}<template v-if="period.to !== period.from">–{{ period.to }}</template></strong
                  >
                  ·
                  {{
                    component.group === "hc"
                      ? "Berechneter Hausverbrauch im Fehlerzustand"
                      : "Fehlerzustand aufgezeichnet"
                  }}
                </li>
              </ul>
              <p class="mb-0">{{ helpText(component.group) }}</p>
            </section>
          </template>
          <p v-else-if="message">
            Aus diesen Meldungen lassen sich keine verlässlichen gerätebezogenen Fehlerzeiträume für diese Ansicht
            ableiten. Prüfe die Tagesansicht und die Status- bzw. Gerätemeldungen des betroffenen Zeitraums.
          </p>

          <section
            v-if="hasRecordingGaps"
            class="component-issue"
          >
            <h3 class="h6 font-weight-bold">
              {{
                message || hasRecordedFaults ? "Zusätzlich: Lücken in der Aufzeichnung" : "Lücken in der Aufzeichnung"
              }}
            </h3>
            <ul>
              <li
                v-for="(gap, index) in quality.gaps"
                :key="index"
              >
                Zwischen {{ gap.from }} und {{ gap.to }} fehlen gegenüber dem üblichen Aufzeichnungsabstand Einträge.
              </li>
            </ul>
            <p class="mb-0">
              Prüfe, ob openWB und die Datenquellen durchgehend liefen. Aus einer Zeitlücke folgt nicht automatisch,
              dass die gesamte Energie fehlt: Fortlaufende Zählerstände können den Verbrauch weiterhin erfassen, aber
              nicht mehr genau zeitlich zuordnen.
            </p>
          </section>

          <p class="small mb-3">
            Nach Beheben der Ursache die aktuellen Werte und Statusmeldungen kontrollieren. Wieder verfügbare Livewerte
            ergänzen fehlende historische Daten nicht automatisch.
          </p>
          <details v-if="message && quality.messagesVisible">
            <summary>Technische Berechnungsmeldungen anzeigen</summary>
            <pre class="technical-messages mt-2 mb-0">{{ message }}</pre>
          </details>
        </div>
      </details>
    </openwb-base-card>
  </div>
</template>

<script>
import OpenwbBaseCard from "../OpenwbBaseCard.vue";
import { analyseLogQuality, logMessage } from "./logDataQuality.js";

export default {
  name: "ChartDataQuality",
  components: { OpenwbBaseCard },
  props: {
    log: { type: Object, default: () => ({}) },
    range: { type: String, default: "day" },
    accessible: { type: Function, default: () => true },
  },
  computed: {
    message() {
      return logMessage(this.log);
    },
    quality() {
      return analyseLogQuality(this.log, this.accessible);
    },
    hasRecordingGaps() {
      return this.range === "day" && this.quality.gaps.length > 0;
    },
    hasRecordedFaults() {
      return this.range === "day" && this.quality.components.length > 0;
    },
    gridFallback() {
      return this.message.includes("Alle Verbräuche werden dem Netz zugerechnet.");
    },
    zeroFallback() {
      return this.message.includes("Die Verbräuche werden mit 0 kWh angesetzt.");
    },
  },
  methods: {
    groupLabel(group) {
      return {
        pv: "Wechselrichter",
        bat: "Speicher",
        counter: "Zähler",
        cp: "Ladepunkt",
        consumer: "Verbraucher",
        hc: "Folge für den Hausverbrauch",
        sh: "SmartHome-Gerät",
      }[group];
    },
    helpText(group) {
      if (group === "hc") {
        return (
          "Der Hausverbrauch wird aus den eingebundenen Messwerten berechnet. Prüfe zuerst die oben genannten " +
          "Datenquellen sowie den Zähler am Netzanschlusspunkt. Dieser Hinweis benennt keinen zusätzlichen Gerätedefekt."
        );
      }
      return (
        "Prüfe die Statusmeldung dieser Komponente in openWB: War das Gerät eingeschaltet und erreichbar? " +
        "Kontrolliere Netzwerkverbindung, Gerätekonfiguration und die gelieferte Schnittstelle " +
        "(z. B. MQTT, Modbus oder HTTP) auf aktuelle, plausible Zählerstände. " +
        "Bei Unklarheiten helfen die Gerätemeldung und das Protokoll des betroffenen Zeitraums."
      );
    },
  },
};
</script>

<style scoped>
.chart-data-quality {
  margin-top: 1rem;
}

summary {
  cursor: pointer;
  font-weight: 600;
}

summary:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

.component-issue {
  border-top: 1px solid #ced4da;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.technical-messages {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 18rem;
  overflow-y: auto;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  color: inherit;
}
</style>
