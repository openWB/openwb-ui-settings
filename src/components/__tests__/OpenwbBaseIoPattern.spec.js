import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseIoPattern from "../OpenwbBaseIoPattern.vue";

describe("OpenwbBaseIoPattern", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseIoPattern, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span />" },
          OpenwbBaseSettingElement: { template: "<span />" },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
