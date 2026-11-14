import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PriceCalculator from "../electricity_pricing/PriceCalculator.vue";

const mountCalculator = (type, data = {}, props = {}) => {
  const wrapper = shallowMount(PriceCalculator, { props: { type, ...props } });
  Object.assign(wrapper.vm, data);
  return wrapper;
};

describe("PriceCalculator.vue", () => {
  it("uses the feed-in tariff as PV price", () => {
    const wrapper = mountCalculator("pv", { pvMethod: "feed_in", feedInPriceInput: 8 });
    expect(wrapper.vm.result).toBe(8);
  });

  it("prefills the feed-in tariff with the configured feed-in price", () => {
    const wrapper = mountCalculator("pv", { pvMethod: "feed_in" }, { feedInPrice: 7.86 });
    expect(wrapper.vm.result).toBe(7.86);
  });

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

  it("adds battery cost to the charging energy price divided by the efficiency", () => {
    const wrapper = mountCalculator("bat", {
      interestRate: 0,
      batInvestment: 6000,
      batRunningCosts: 0,
      batCapacity: 10,
      batCyclesPerYear: 250,
      batYears: 15,
      batEfficiency: 90,
      batChargePrice: 9,
    });
    // 6000 / (10 * 250 * 15) = 16 ct + 9 / 0.9 = 10 ct
    expect(wrapper.vm.result).toBe(26);
  });

  it("prefills the charging energy price with the PV price", () => {
    const wrapper = mountCalculator("bat", {}, { pvPrice: 6.44 });
    expect(wrapper.vm.batChargePrice).toBe(6.44);
  });

  it("returns no result for incomplete input", () => {
    expect(mountCalculator("bat", { batCapacity: 0 }).vm.result).toBeUndefined();
    expect(mountCalculator("bat", { batCapacity: 0 }).vm.resultText).toBe("-");
    expect(mountCalculator("pv", { pvYield: 0 }).vm.result).toBeUndefined();
  });
});
