import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Consumer from "./consumer.vue";

function mountConsumer(configuration = { ip_address: "heishamon.local", read_temperatures: true }) {
  return mount(Consumer, {
    props: {
      consumer: { vendor: "heishamon", type: "heishamon", configuration },
    },
    global: {
      stubs: {
        OpenwbBaseHeading: { template: "<h2><slot /></h2>" },
        OpenwbBaseAlert: { template: "<div><slot /></div>" },
        OpenwbBaseTextInput: {
          name: "OpenwbBaseTextInput",
          props: ["title", "subtype", "required", "modelValue"],
          template: "<div><slot name='help' /></div>",
        },
        OpenwbBaseCheckboxInput: {
          name: "OpenwbBaseCheckboxInput",
          props: ["title", "modelValue"],
          template: "<div><slot name='help' /></div>",
        },
      },
    },
  });
}

describe("HeishaMon consumer settings", () => {
  it("displays the configured host in a required host input", () => {
    const wrapper = mountConsumer();
    const host = wrapper.findComponent({ name: "OpenwbBaseTextInput" });

    expect(host.props("modelValue")).toBe("heishamon.local");
    expect(host.props("subtype")).toBe("host");
    expect(host.props("required")).toBeDefined();
    expect(wrapper.text()).toContain("ohne http:// und ohne /json");
  });

  it("emits host changes without mutating the consumer configuration", async () => {
    const configuration = { ip_address: "heishamon.local", read_temperatures: true };
    const wrapper = mountConsumer(configuration);

    await wrapper.findComponent({ name: "OpenwbBaseTextInput" }).vm.$emit("update:model-value", "192.0.2.27");

    expect(wrapper.emitted("update:configuration")).toEqual([
      [{ value: "192.0.2.27", object: "configuration.ip_address" }],
    ]);
    expect(configuration.ip_address).toBe("heishamon.local");
  });

  it.each([true, false])("displays the configured temperature toggle: %s", (enabled) => {
    const wrapper = mountConsumer({ ip_address: "heishamon.local", read_temperatures: enabled });

    expect(wrapper.findComponent({ name: "OpenwbBaseCheckboxInput" }).props("modelValue")).toBe(enabled);
  });

  it.each([true, false])("emits the temperature toggle as a boolean: %s", async (enabled) => {
    const configuration = { ip_address: "heishamon.local", read_temperatures: !enabled };
    const wrapper = mountConsumer(configuration);

    await wrapper.findComponent({ name: "OpenwbBaseCheckboxInput" }).vm.$emit("update:model-value", enabled);

    expect(wrapper.emitted("update:configuration")).toEqual([
      [{ value: enabled, object: "configuration.read_temperatures" }],
    ]);
    expect(configuration.read_temperatures).toBe(!enabled);
  });

  it("documents the fixed temperature order and the supported power field", () => {
    const text = mountConsumer().text();

    expect(text).toMatch(/1\. Rücklauf \(Main_Inlet_Temp\).*2\. Vorlauf.*3\. Solltemperatur/s);
    expect(text).toContain("Heat_Power_Consumption");
    expect(text).toContain("Heat_Power_Consumption_Extra");
    expect(text).toContain("Die Wärmepumpe wird nicht gesteuert");
  });
});
