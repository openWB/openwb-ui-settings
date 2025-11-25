import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseNumberInput from "../OpenwbBaseNumberInput.vue";

describe("OpenwbBaseNumberInput.vue", () => {
  // check title prop
  it("render title", () => {
    const title = "Number Input Test";
    const wrapper = mount(OpenwbBaseNumberInput, {
      props: { title },
    });
    const titleLabel = wrapper.find("div.col-form-label");
    expect(titleLabel.html()).toContain(title);
  });
  // check unit prop
  it("render unit", () => {
    const unit = "$";
    const wrapper = mount(OpenwbBaseNumberInput, {
      props: { unit },
    });
    const unitDiv = wrapper.find("div.input-group-append");
    expect(unitDiv.html()).toContain(unit);
  });
  // check initial value
  it("display initial value", () => {
    const modelValue = 2;
    const wrapper = mount(OpenwbBaseNumberInput, {
      props: { modelValue },
    });
    const renderedInput = wrapper.find("input[type=number]");
    expect(parseInt(renderedInput.element.value)).toBe(modelValue);
  });
  // check user input
  it("emit on change", async () => {
    const modelValue = 2;
    const wrapper = mount(OpenwbBaseNumberInput, {
      props: { modelValue },
    });
    const renderedInput = wrapper.find("input[type=number]");
    await renderedInput.setValue(10);
    expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([10]);
  });
});
