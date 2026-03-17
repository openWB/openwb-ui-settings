import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseTextarea from "../OpenwbBaseTextarea.vue";

describe("OpenwbBaseTextarea", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseTextarea, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
      props: { modelValue: "TestText" },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("textarea").element.value).toBe("TestText");
  });

  it("emits update:modelValue when input changes", async () => {
    const wrapper = mount(OpenwbBaseTextarea, {
      global: {
        stubs: {
          OpenwbBaseTooltip: { template: "<span><slot /></span>" },
        },
      },
      props: { modelValue: "" },
    });
    const textarea = wrapper.find("textarea");
    await textarea.setValue("NewText");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual(["NewText"]);
  });
});
