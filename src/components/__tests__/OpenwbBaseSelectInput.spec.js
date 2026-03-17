import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseSelectInput from "../OpenwbBaseSelectInput.vue";

describe("OpenwbBaseSelectInput", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseSelectInput, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
      props: {
        options: [
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ],
        modelValue: "a",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits update:modelValue when selection changes", async () => {
    const wrapper = mount(OpenwbBaseSelectInput, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
      props: {
        options: [
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ],
        modelValue: "a",
      },
    });
    await wrapper.find("select").setValue("b");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual(["b"]);
  });
});
