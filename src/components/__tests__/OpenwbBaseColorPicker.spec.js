import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseColorPicker from "../OpenwbBaseColorPicker.vue";

describe("OpenwbBaseColorPicker", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseColorPicker, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
          Popper: { template: "<span><slot /></span>" },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
