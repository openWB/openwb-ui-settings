import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseButtonGroupInput from "../OpenwbBaseButtonGroupInput.vue";

describe("OpenwbBaseButtonGroupInput.vue", () => {
  // general constants
  const title = "Button Group Test";
  const buttons = [
    { buttonValue: 1, text: "Button 1" },
    { buttonValue: 2, text: "Button 2" },
  ];
  // check title prop
  it("render title", () => {
    const wrapper = mount(OpenwbBaseButtonGroupInput, {
      props: { title, buttons },
    });
    const titleLabel = wrapper.find("div.col-form-label");
    expect(titleLabel.html()).toContain(title);
  });
  // check buttons
  it("render buttons", () => {
    const modelValue = 2;
    const wrapper = mount(OpenwbBaseButtonGroupInput, {
      props: { buttons, modelValue },
    });
    const renderedButtons = wrapper.findAll("label.btn");
    expect(renderedButtons[0].classes("active")).toBe(false);
    expect(renderedButtons[1].classes("active")).toBe(true);
  });
  // check user input
  it("emit on click", async () => {
    const modelValue = 2;
    const wrapper = mount(OpenwbBaseButtonGroupInput, {
      props: { buttons, modelValue },
    });
    const renderedButtons = wrapper.findAll("input[type=radio]");
    await renderedButtons[0].setValue(1);
    expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([1]);
  });
});
