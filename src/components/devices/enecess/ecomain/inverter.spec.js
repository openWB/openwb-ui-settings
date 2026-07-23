import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Inverter from "./inverter.vue";

const baseChannels = [
  { phase: 1, source: 0, channel: 1 },
  { phase: 2, source: 0, channel: 2 },
  { phase: 3, source: 0, channel: 3 },
];

function mountInverter(configuration) {
  return mount(Inverter, {
    props: {
      device: { configuration: {} },
      component: { configuration },
    },
    global: {
      stubs: {
        OpenwbBaseAlert: true,
        OpenwbBaseCheckboxInput: true,
        OpenwbBaseHeading: true,
        OpenwbBaseNumberInput: true,
        OpenwbBaseSelectInput: {
          name: "OpenwbBaseSelectInput",
          props: ["title", "required", "options", "modelValue"],
          template: "<div />",
        },
      },
    },
  });
}

describe("EcoMain inverter settings", () => {
  it("uses numeric channel dropdown options and emits numeric channel updates", async () => {
    const wrapper = mountInverter({
      phase_count: 1,
      invert: false,
      channels: [{ phase: 1, source: 0, channel: 1 }],
    });

    const channelEditor = wrapper
      .findAllComponents({ name: "OpenwbBaseSelectInput" })
      .find((editor) => editor.props("title") === "Kanal");

    expect(wrapper.findComponent({ name: "OpenwbBaseNumberInput" }).exists()).toBe(false);
    expect(channelEditor.props("options")).toEqual(
      Array.from({ length: 10 }, (_, index) => ({ value: index + 1, text: String(index + 1) })),
    );

    await channelEditor.vm.$emit("update:model-value", 10);

    expect(wrapper.emitted("update:configuration")).toContainEqual([
      { value: [{ phase: 1, source: 0, channel: 10 }], object: "configuration.channels" },
    ]);
  });

  it("adds unique phases and physical channels without mutating the configured channel", () => {
    const configuration = {
      phase_count: 1,
      invert: false,
      channels: [{ phase: 3, source: 0, channel: 2 }],
    };
    const wrapper = mountInverter(configuration);

    wrapper.vm.changePhaseCount(3);

    const updates = wrapper.emitted("update:configuration").map(([update]) => update);
    expect(updates[0]).toEqual({ value: 3, object: "configuration.phase_count" });
    expect(updates[1].object).toBe("configuration.channels");

    const channels = updates[1].value;
    expect(channels).toHaveLength(3);
    expect(channels[0]).toEqual({ phase: 3, source: 0, channel: 2 });
    expect(new Set(channels.map(({ phase }) => phase))).toEqual(new Set([1, 2, 3]));
    expect(new Set(channels.map(({ source, channel }) => `${source}:${channel}`)).size).toBe(3);
    expect(configuration.channels).toEqual([{ phase: 3, source: 0, channel: 2 }]);
  });

  it("keeps only the first channel when switching to single phase", () => {
    const configuration = {
      phase_count: 3,
      invert: false,
      channels: baseChannels,
    };
    const wrapper = mountInverter(configuration);

    wrapper.vm.changePhaseCount(1);

    const updates = wrapper.emitted("update:configuration").map(([update]) => update);
    expect(updates).toEqual([
      { value: 1, object: "configuration.phase_count" },
      { value: [{ phase: 1, source: 0, channel: 1 }], object: "configuration.channels" },
    ]);
    expect(configuration.channels).toEqual(baseChannels);
  });

  it.each([
    [
      "accepts a valid single-phase configuration",
      { phase_count: 1, invert: false, channels: [{ phase: 1, source: 0, channel: 1 }] },
      "",
    ],
    [
      "rejects an unsupported phase count",
      { phase_count: 2, invert: false, channels: baseChannels.slice(0, 2) },
      "Die Phasenanzahl muss 1 oder 3 sein.",
    ],
    [
      "rejects a channel count that differs from the phase count",
      { phase_count: 3, invert: false, channels: baseChannels.slice(0, 2) },
      "Die Anzahl der EcoMain-Kanäle stimmt nicht mit der Phasenanzahl überein.",
    ],
    [
      "rejects an invalid phase",
      { phase_count: 1, invert: false, channels: [{ phase: 4, source: 0, channel: 1 }] },
      "Die Phase muss L1, L2 oder L3 sein.",
    ],
    [
      "rejects an invalid source",
      { phase_count: 1, invert: false, channels: [{ phase: 1, source: 4, channel: 1 }] },
      "Die Quelle muss Hauptgerät oder Slave 1 bis 3 sein.",
    ],
    [
      "rejects channel 11",
      { phase_count: 1, invert: false, channels: [{ phase: 1, source: 0, channel: 11 }] },
      "Der EcoMain-Kanal muss zwischen 1 und 10 liegen.",
    ],
    [
      "rejects duplicate phases",
      {
        phase_count: 3,
        invert: false,
        channels: [baseChannels[0], { ...baseChannels[1], phase: 1 }, baseChannels[2]],
      },
      "Bei dreiphasiger Messung müssen L1, L2 und L3 jeweils einmal konfiguriert sein.",
    ],
    [
      "rejects duplicate physical channels",
      {
        phase_count: 3,
        invert: false,
        channels: [baseChannels[0], { phase: 2, source: 0, channel: 1 }, baseChannels[2]],
      },
      "Eine EcoMain-Quelle und ein Kanal dürfen nicht mehrfach verwendet werden.",
    ],
  ])("%s", (_name, configuration, expectedError) => {
    const wrapper = mountInverter(configuration);

    expect(wrapper.vm.validationError).toBe(expectedError);
  });
});
