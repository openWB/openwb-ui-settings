import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbSortableList from "../OpenwbSortableList.vue";

describe("OpenwbSortableList", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbSortableList, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
