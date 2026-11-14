import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PriceCalculator from "../electricity_pricing/PriceCalculator.vue";

const mountCalculator = (type, data = {}) => {
  const wrapper = shallowMount(PriceCalculator, { props: { type } });
  Object.assign(wrapper.vm, data);
  return wrapper;
};

describe("PriceCalculator.vue", () => {
  it("calculates PV levelized cost without discounting and degradation", () => {
    const wrapper = mountCalculator("pv", {
      interestRate: 0,
      pvDegradation: 0,
      pvInvestment: 12000,
      pvYears: 25,
      pvYield: 9000,
      pvRunningCosts: 100,
    });
    // (12000 + 25 * 100) / (25 * 9000) = 0.0644 EUR/kWh
    expect(wrapper.vm.result).toBe(6.44);
  });

  it("calculates PV levelized cost with the default discounted assumptions", () => {
    const wrapper = mountCalculator("pv");
    expect(wrapper.vm.result).toBeCloseTo(8.66, 2);
  });

  it("calculates battery cost per discharged kWh without charging energy", () => {
    const wrapper = mountCalculator("bat", {
      interestRate: 0,
      batInvestment: 6000,
      batRunningCosts: 0,
      batCapacity: 10,
      batCyclesPerYear: 250,
      batYears: 15,
    });
    // 6000 / (10 * 250 * 15) = 0.16 EUR/kWh
    expect(wrapper.vm.result).toBe(16);
  });

  it("calculates battery cost with the default discounted assumptions", () => {
    const wrapper = mountCalculator("bat");
    expect(wrapper.vm.result).toBeCloseTo(24.25, 2);
  });

  it("returns no result for incomplete input", () => {
    expect(mountCalculator("bat", { batCapacity: 0 }).vm.result).toBeUndefined();
    expect(mountCalculator("bat", { batCapacity: 0 }).vm.resultText).toBe("-");
    expect(mountCalculator("pv", { pvYield: 0 }).vm.result).toBeUndefined();
  });
});
