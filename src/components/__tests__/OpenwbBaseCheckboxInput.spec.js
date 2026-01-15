import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseCheckboxInput from "../OpenwbBaseCheckboxInput.vue";

describe("OpenwbBaseCheckboxInput.vue", () => {
  // check title prop
  it("render title", () => {
    const title = "Checkbox Test";
    const wrapper = mount(OpenwbBaseCheckboxInput, {
      props: { title },
    });
    const titleLabel = wrapper.find("div.col-form-label");
    expect(titleLabel.html()).toContain(title);
  });
  // check buttons
  it("render checkbox", () => {
    const modelValue = true;
    const wrapper = mount(OpenwbBaseCheckboxInput, {
      props: { modelValue },
    });
    const renderedCheckbox = wrapper.find("input[type=checkbox]");
    expect(renderedCheckbox.exists()).toBe(true);
  });
  // check user input
  it("emit on click", async () => {
    const modelValue = false;
    const wrapper = mount(OpenwbBaseCheckboxInput, {
      props: { modelValue },
    });
    const renderedCheckbox = wrapper.find("input[type=checkbox]");
    await renderedCheckbox.setValue(true);
    expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([true]);
  });
});
