import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseColorPicker from "../OpenwbBaseColorPicker.vue";

describe("OpenwbBaseColorPicker", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseColorPicker, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits input event when color changes", async () => {
    const wrapper = mount(OpenwbBaseColorPicker, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
    });
    await wrapper.find('input[type="color"]').setValue("#ff0000");
    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
