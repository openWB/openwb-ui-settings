<template>
  <div class="price-calculator">
    <openwb-base-alert subtype="info">
      Hilfsrechner: Das Ergebnis ist nur ein Vorschlag. Du kannst den Preis danach übernehmen oder oben direkt einen
      eigenen Preis eintragen.
    </openwb-base-alert>
    <div v-if="type === 'pv'">
      <openwb-base-button-group-input
        v-model="pvMethod"
        title="Berechnung"
        :buttons="[
          { buttonValue: 'lcoe', text: 'Stromgestehungskosten' },
          { buttonValue: 'feed_in', text: 'Einspeisevergütung' },
        ]"
      >
        <template #help>
          Stromgestehungskosten: Kosten der Anlage über die gesamte Nutzungsdauer, bezogen auf die erzeugte Energie.<br />
          Einspeisevergütung: Jede selbst genutzte kWh wird nicht eingespeist. Die entgangene Vergütung ist der Preis
          für PV-Strom.
        </template>
      </openwb-base-button-group-input>
      <openwb-base-number-input
        v-if="pvMethod === 'feed_in'"
        v-model="feedInPriceInput"
        title="Einspeisevergütung"
        unit="ct/kWh"
        :min="0"
        :step="0.1"
        :precision="2"
      />
      <div v-else>
        <openwb-base-number-input
          v-model="pvInvestment"
          title="Investition (Module, Wechselrichter, Montage)"
          unit="€"
          :min="0"
          :step="100"
        />
        <openwb-base-number-input
          v-model="pvYield"
          title="Ertrag im ersten Jahr"
          unit="kWh"
          :min="1"
          :step="50"
        />
        <openwb-base-number-input
          v-model="pvYears"
          title="Nutzungsdauer"
          unit="Jahre"
          :min="1"
          :step="1"
        />
        <openwb-base-button-input
          :title="showAdvanced ? 'Weitere Annahmen ausblenden' : 'Weitere Annahmen'"
          :button-text="showAdvanced ? 'Ausblenden' : 'Einblenden'"
          @button-clicked="showAdvanced = !showAdvanced"
        />
        <div v-if="showAdvanced">
          <openwb-base-number-input
            v-model="pvRunningCosts"
            title="Betriebskosten pro Jahr"
            unit="€"
            :min="0"
            :step="10"
          />
          <openwb-base-number-input
            v-model="pvDegradation"
            title="Degradation pro Jahr"
            unit="%"
            :min="0"
            :step="0.1"
            :precision="1"
          />
          <openwb-base-number-input
            v-model="interestRate"
            title="Kalkulationszinssatz"
            unit="%"
            :min="0"
            :step="0.1"
            :precision="1"
          >
            <template #help>
              Kosten und Erträge werden mit diesem Zinssatz abgezinst. Mit 0 % wird nicht abgezinst.
            </template>
          </openwb-base-number-input>
        </div>
      </div>
    </div>
    <div v-else>
      <openwb-base-number-input
        v-model="batInvestment"
        title="Investition Speicher"
        unit="€"
        :min="0"
        :step="100"
      />
      <openwb-base-number-input
        v-model="batCapacity"
        title="Nutzbare Kapazität"
        unit="kWh"
        :min="0.1"
        :step="0.5"
        :precision="1"
      />
      <openwb-base-number-input
        v-model="batCyclesPerYear"
        title="Volllastzyklen pro Jahr"
        unit=""
        :min="1"
        :step="5"
      >
        <template #help>
          Entladene Energie pro Jahr geteilt durch die nutzbare Kapazität, typisch 200 bis 300.
        </template>
      </openwb-base-number-input>
      <openwb-base-number-input
        v-model="batEfficiency"
        title="Wirkungsgrad (Laden und Entladen)"
        unit="%"
        :min="1"
        :max="100"
        :step="1"
      />
      <openwb-base-number-input
        v-model="batYears"
        title="Lebensdauer"
        unit="Jahre"
        :min="1"
        :step="1"
      />
      <openwb-base-number-input
        v-model="batChargePrice"
        title="Preis der geladenen Energie"
        unit="ct/kWh"
        :min="0"
        :step="0.1"
        :precision="2"
      >
        <template #help>
          Vorbelegt mit dem PV-Preis, da der Speicher überwiegend mit PV-Strom geladen wird. Wird auch aus dem Netz
          geladen, kann hier ein Mischpreis eingetragen werden.
        </template>
      </openwb-base-number-input>
      <openwb-base-button-input
        :title="showAdvanced ? 'Weitere Annahmen ausblenden' : 'Weitere Annahmen'"
        :button-text="showAdvanced ? 'Ausblenden' : 'Einblenden'"
        @button-clicked="showAdvanced = !showAdvanced"
      />
      <div v-if="showAdvanced">
        <openwb-base-number-input
          v-model="batRunningCosts"
          title="Betriebskosten pro Jahr"
          unit="€"
          :min="0"
          :step="5"
        />
        <openwb-base-number-input
          v-model="interestRate"
          title="Kalkulationszinssatz"
          unit="%"
          :min="0"
          :step="0.1"
          :precision="1"
        />
      </div>
    </div>
    <openwb-base-alert subtype="success">
      Ergebnis: <strong>{{ resultText }}</strong>
      <span v-if="detailText">
        <br />
        {{ detailText }}
      </span>
    </openwb-base-alert>
    <div class="d-flex justify-content-end">
      <openwb-base-click-button
        class="btn-success"
        :disabled="result === undefined"
        @click="$emit('apply', result)"
      >
        Preis übernehmen
      </openwb-base-click-button>
    </div>
  </div>
</template>

<script>
// Summe über die Jahre 1..years von series(t) / (1 + rate)^t
function discountedSum(series, years, rate) {
  let sum = 0;
  for (let t = 1; t <= years; t++) {
    sum += series(t) / Math.pow(1 + rate, t);
  }
  return sum;
}

export default {
  name: "OpenwbPriceCalculator",
  props: {
    // "pv" oder "bat"
    type: { type: String, required: true },
    // aktueller PV-Preis in ct/kWh, Vorbelegung für den Preis der geladenen Energie des Speichers
    pvPrice: { type: Number, default: undefined },
    // aktueller Einspeisepreis in ct/kWh, Vorbelegung der Einspeisevergütung
    feedInPrice: { type: Number, default: undefined },
  },
  emits: ["apply"],
  data() {
    return {
      showAdvanced: false,
      interestRate: 3,
      pvMethod: "lcoe",
      feedInPriceInput: this.feedInPrice !== undefined ? parseFloat(this.feedInPrice.toFixed(2)) : 8,
      pvInvestment: 12000,
      pvYield: 9500,
      pvYears: 25,
      pvRunningCosts: 100,
      pvDegradation: 0.4,
      batInvestment: 7000,
      batCapacity: 10,
      batCyclesPerYear: 250,
      batEfficiency: 90,
      batYears: 15,
      batRunningCosts: 20,
      batChargePrice: this.pvPrice !== undefined ? parseFloat(this.pvPrice.toFixed(2)) : 10,
    };
  },
  computed: {
    rate() {
      return (this.interestRate || 0) / 100;
    },
    // PV-Stromgestehungskosten in ct/kWh (abgezinste LCOE-Methode)
    pvLcoe() {
      if (!(this.pvYears > 0) || !(this.pvYield > 0)) {
        return undefined;
      }
      const costs = this.pvInvestment + discountedSum(() => this.pvRunningCosts, this.pvYears, this.rate);
      const energy = discountedSum(
        (t) => this.pvYield * Math.pow(1 - this.pvDegradation / 100, t - 1),
        this.pvYears,
        this.rate,
      );
      return (costs / energy) * 100;
    },
    // Speicherkosten pro entladener kWh in ct/kWh, ohne Kosten der geladenen Energie
    batLcoe() {
      if (!(this.batYears > 0) || !(this.batCapacity > 0) || !(this.batCyclesPerYear > 0)) {
        return undefined;
      }
      const costs = this.batInvestment + discountedSum(() => this.batRunningCosts, this.batYears, this.rate);
      // Zyklen werden über die entladene Energie bestimmt
      const dischargedPerYear = this.batCyclesPerYear * this.batCapacity;
      const energy = discountedSum(() => dischargedPerYear, this.batYears, this.rate);
      return (costs / energy) * 100;
    },
    // Ergebnis in ct/kWh, undefined wenn die Eingaben nicht reichen
    result() {
      let ctPerKwh;
      if (this.type === "pv") {
        ctPerKwh = this.pvMethod === "feed_in" ? this.feedInPriceInput : this.pvLcoe;
      } else if (this.batLcoe !== undefined && this.batEfficiency > 0) {
        // Verluste im Speicher verteuern die Ladeenergie: Preis / Wirkungsgrad + Speicherkosten
        ctPerKwh = this.batChargePrice / (this.batEfficiency / 100) + this.batLcoe;
      }
      if (ctPerKwh === undefined || !Number.isFinite(ctPerKwh)) {
        return undefined;
      }
      return parseFloat(ctPerKwh.toFixed(2));
    },
    resultText() {
      return this.result === undefined ? "-" : `${this.result.toFixed(2)} ct/kWh`;
    },
    detailText() {
      if (this.result === undefined || this.type !== "bat") {
        return "";
      }
      return `davon ${this.batLcoe.toFixed(2)} ct/kWh für den Speicher selbst`;
    },
  },
};
</script>
