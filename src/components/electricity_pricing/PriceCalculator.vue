<template>
  <div class="price-calculator">
    <openwb-base-alert subtype="info">
      Hilfsrechner: Das Ergebnis ist nur ein Vorschlag. Du kannst den Preis danach übernehmen oder oben direkt einen
      eigenen Preis eintragen.
    </openwb-base-alert>
    <div v-if="type === 'pv'">
      <openwb-base-number-input
        v-model="pvInvestment"
        title="Investition (Module, Wechselrichter, Montage)"
        unit="€"
        :min="0"
        step="any"
      />
      <openwb-base-number-input
        v-model="pvYield"
        title="Ertrag im ersten Jahr"
        unit="kWh"
        :min="1"
        step="any"
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
          step="any"
        />
        <openwb-base-number-input
          v-model="pvDegradation"
          title="Degradation pro Jahr"
          unit="%"
          :min="0"
          step="any"
          :precision="1"
        />
        <openwb-base-number-input
          v-model="interestRate"
          title="Kalkulationszinssatz"
          unit="%"
          :min="0"
          step="any"
          :precision="1"
        >
          <template #help>
            Kosten und Erträge werden mit diesem Zinssatz abgezinst. Mit 0 % wird nicht abgezinst.
          </template>
        </openwb-base-number-input>
      </div>
    </div>
    <div v-else>
      <openwb-base-number-input
        v-model="batInvestment"
        title="Investition Speicher"
        unit="€"
        :min="0"
        step="any"
      />
      <openwb-base-number-input
        v-model="batCapacity"
        title="Nutzbare Kapazität"
        unit="kWh"
        :min="0.1"
        step="any"
        :precision="1"
      />
      <openwb-base-number-input
        v-model="batCyclesPerYear"
        title="Volllastzyklen pro Jahr"
        unit=""
        :min="1"
        step="any"
      >
        <template #help>
          Entladene Energie pro Jahr geteilt durch die nutzbare Kapazität, typisch 200 bis 300.
        </template>
      </openwb-base-number-input>
      <openwb-base-number-input
        v-model="batYears"
        title="Lebensdauer"
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
          v-model="batRunningCosts"
          title="Betriebskosten pro Jahr"
          unit="€"
          :min="0"
          step="any"
        />
        <openwb-base-number-input
          v-model="interestRate"
          title="Kalkulationszinssatz"
          unit="%"
          :min="0"
          step="any"
          :precision="1"
        />
      </div>
      <openwb-base-alert subtype="warning">
        Berechnet werden nur die Kosten des Speichers selbst pro entladener kWh. Die Kosten der geladenen Energie und
        die Verluste beim Laden und Entladen sind nicht enthalten.
      </openwb-base-alert>
    </div>
    <openwb-base-alert subtype="success">
      Ergebnis: <strong>{{ resultText }}</strong>
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
  },
  emits: ["apply"],
  data() {
    return {
      showAdvanced: false,
      interestRate: 3,
      pvInvestment: 12000,
      pvYield: 9500,
      pvYears: 25,
      pvRunningCosts: 100,
      pvDegradation: 0.4,
      batInvestment: 7000,
      batCapacity: 10,
      batCyclesPerYear: 250,
      batYears: 15,
      batRunningCosts: 20,
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
      const ctPerKwh = this.type === "pv" ? this.pvLcoe : this.batLcoe;
      if (ctPerKwh === undefined || !Number.isFinite(ctPerKwh)) {
        return undefined;
      }
      return parseFloat(ctPerKwh.toFixed(2));
    },
    resultText() {
      return this.result === undefined ? "-" : `${this.result.toFixed(2)} ct/kWh`;
    },
  },
};
</script>
