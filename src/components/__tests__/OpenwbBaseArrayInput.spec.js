import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseArrayInput from "../OpenwbBaseArrayInput.vue";

describe("OpenwbBaseArrayInput.vue", () => {
  const title = "Array Input Test";
  // check title prop
  it("render title", () => {
    const wrapper = mount(OpenwbBaseArrayInput, {
      props: { title },
    });
    const titleLabel = wrapper.find("label.col-form-label");
    expect(titleLabel.html()).toContain(title);
  });
  // check initial value
  it("display initial value", () => {
    const modelValue = ["1234", "2345"];
    const wrapper = mount(OpenwbBaseArrayInput, {
      props: { title, modelValue },
    });
    const renderedTagList = wrapper.find(".tagList");
    modelValue.forEach((element) => {
      expect(renderedTagList.html()).toContain(element);
    });
  });
  // check user input
  it("add element", async () => {
    const newTag = "1234";
    const wrapper = mount(OpenwbBaseArrayInput, {
      props: { title },
    });
    const renderedTextInput = wrapper.find("input[type=text]");
    await renderedTextInput.setValue(newTag);
    const renderedAddButton = wrapper.find(".input-group-append .input-group-text");
    await renderedAddButton.trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([[newTag]]);
  });
});
